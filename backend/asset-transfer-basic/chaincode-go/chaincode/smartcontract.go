package chaincode

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically
type Product struct {
	ID            string `json:"ID"`
	Name          string `json:"Name"`
	Description   string `json:"Description"`
	Price   	  string `json:"Price"`
	Status        string `json:"Status"` // Status can be "Pending", "Accepted", "Shipped", "Delivered", etc.
	Manufacturer  string `json:"Manufacturer"`
	Consumer      string `json:"Consumer"`
	CreatedDate   string `json:"CreatedDate"`
	ModifiedDate  string `json:"ModifiedDate"`
	DeliveredDate string `json:"DeliveredDate"`
	OwnerType 	  string `json:"OwnerType"`
}

// InitLedger adds a base set of assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org1 to execute this function
	if clientOrg != "Org1MSP" {
		return errors.New("Access denied: Only peers in Org1 are allowed to execute InitLedger")
	}
	assets := []Product{
		{ID: "1", Name: "apple", Description: "good", Status: "Created", Manufacturer: "null", Consumer: "null", CreatedDate: "null", DeliveredDate: "null"},
		{ID: "2", Name: "orange", Description: "good", Status: "Created", Manufacturer: "null", Consumer: "null", CreatedDate: "null", DeliveredDate: "null"},
	}

	for _, asset := range assets {
		assetJSON, err := json.Marshal(asset)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(asset.ID, assetJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

// ProductExists checks if a product with the given ID exists in the world state
func (s *SmartContract) ProductExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	productJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return productJSON != nil, nil
}

func (s *SmartContract) CreateProduct(ctx contractapi.TransactionContextInterface, id string, name string, description string, price string, manufacturer string, createddate string) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org1 to execute this function
	if clientOrg != "Org1MSP" {
		return errors.New("Access denied: Only peers in Org1 are allowed to execute CreateProduct")
	}
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the product %s already exists", id)
	}

	product := Product{
		ID:            id,
		Name:          name,
		Description:   description,
		Price:		   price,
		Status:        "Pending",
		Manufacturer:  manufacturer,
		Consumer:      "null",
		CreatedDate:   createddate,
		ModifiedDate:  "null",
		DeliveredDate: "null",
		OwnerType:	   id,
	}

	productJSON, err := json.Marshal(product)
	
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, productJSON)
}

// GetAllProducts returns all products stored in the world state
func (s *SmartContract) GetAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	// Range query with an empty string for startKey and endKey retrieves all products in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	
	if err != nil {
		return nil, fmt.Errorf("failed to get state by range: %v", err)
	}

	defer resultsIterator.Close()

	var products []*Product
	
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("error iterating over query results: %v", err)
		}

		var product Product
		err = json.Unmarshal(queryResponse.Value, &product)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling product JSON: %v", err)
		}
		products = append(products, &product)
	}

	return products, nil
}

func (s *SmartContract) GetProductsByManufacturer(ctx contractapi.TransactionContextInterface, manufacturer string) ([]*Product, error) {
	// Range query with an empty string for startKey and endKey retrieves all products in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get state by range: %v", err)
	}
	defer resultsIterator.Close()

	var products []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("error iterating over query results: %v", err)
		}

		var product Product
		err = json.Unmarshal(queryResponse.Value, &product)
		if err != nil {
			return nil, fmt.Errorf("error unmarshalling product JSON: %v", err)
		}

		// Check if the product's Manufacture matches the given parameter
		if product.Manufacturer == manufacturer {
			products = append(products, &product)
		}
	}

	return products, nil
}

func (s *SmartContract) UpdateProduct(ctx contractapi.TransactionContextInterface, id string, name string, description string, price string, manufacturer string, modifieddate string) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org1 to execute this function
	if clientOrg != "Org1MSP" {
		return errors.New("Access denied: Only peers in Org1 are allowed to execute UpdateProduct")
	}
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the product %s does not exist", id)
	}

	// Retrieve the existing product
	existingProductJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read existing product from world state: %v", err)
	}
	var existingProduct Product
	err = json.Unmarshal(existingProductJSON, &existingProduct)
	if err != nil {
		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
	}
	if existingProduct.Manufacturer != manufacturer {
		return errors.New("You can update only the products that you created")

	}

	// Update the product attributes

	existingProduct.Name = name
	existingProduct.Description = description
	existingProduct.Price = price
	existingProduct.ModifiedDate = modifieddate

	// Marshal the updated product
	updatedProductJSON, err := json.Marshal(existingProduct)
	if err != nil {
		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
	}

	// Put the updated product back to the world state
	err = ctx.GetStub().PutState(id, updatedProductJSON)
	if err != nil {
		return fmt.Errorf("failed to update product in world state: %v", err)
	}

	return nil
}

// ProductOrder updates the status and owner of a product to mark it as ordered
func (s *SmartContract) ProductOrder(ctx contractapi.TransactionContextInterface, id string, newOwner string, modifieddate string) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org2 to execute this function
	if clientOrg != "Org2MSP" {
		return errors.New("Access denied: Only peers in Org2 are allowed to execute ProductOrder")
	}
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the product %s does not exist", id)
	}

	// Retrieve the existing product
	existingProductJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read existing product from world state: %v", err)
	}
	var existingProduct Product
	err = json.Unmarshal(existingProductJSON, &existingProduct)
	if err != nil {
		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
	}
	// Check if the product is already ordered
	if existingProduct.Status == "Accepted" {
		return fmt.Errorf("the product %s is already ordered", id)
	}
	// Check if the product is already delivered
	if existingProduct.Status == "Delivered" {
		return fmt.Errorf("the product %s is already delivered", id)
	}

	// Update the product status and owner
	existingProduct.Status = "Pending Order Request"
	existingProduct.Consumer = newOwner
	existingProduct.ModifiedDate = modifieddate

	// Marshal the updated product
	updatedProductJSON, err := json.Marshal(existingProduct)
	if err != nil {
		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
	}

	// Put the updated product back to the world state
	err = ctx.GetStub().PutState(id, updatedProductJSON)
	if err != nil {
		return fmt.Errorf("failed to update product in world state: %v", err)
	}

	return nil
}

func (s *SmartContract) ProductDeliver(ctx contractapi.TransactionContextInterface, id string, manufacturer string, delivereddate string) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org1 to execute this function
	if clientOrg != "Org1MSP" {
		return errors.New("Access denied: Only peers in Org1 are allowed to execute ProductDeliver")
	}
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the product %s does not exist", id)
	}

	// Retrieve the existing product
	existingProductJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read existing product from world state: %v", err)
	}
	var existingProduct Product
	err = json.Unmarshal(existingProductJSON, &existingProduct)
	if err != nil {
		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
	}

	// if existingProduct.Status != "Ordered" {
	// 	return fmt.Errorf("the product %s has not been ordered or has already delivered", id)
	// }
	if existingProduct.Manufacturer != manufacturer {
		return errors.New("You can only deliver your own products")
	}

	existingProduct.Status = "Delivered"
	existingProduct.DeliveredDate = delivereddate
	existingProduct.ModifiedDate = delivereddate

	// Marshal the updated product
	updatedProductJSON, err := json.Marshal(existingProduct)
	if err != nil {
		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
	}

	// Put the updated product back to the world state
	err = ctx.GetStub().PutState(id, updatedProductJSON)
	if err != nil {
		return fmt.Errorf("failed to update product in world state: %v", err)
	}

	return nil
}

// ProductAccept updates the status of a product to mark it as accepted by the manufacturer
func (s *SmartContract) ProductAccept(ctx contractapi.TransactionContextInterface, id string, manufacturer string, modifieddate string) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org1 to execute this function (assuming manufacturer is in Org1)
	if clientOrg != "Org1MSP" {
		return errors.New("Access denied: Only peers in Org1 are allowed to execute ProductAccept")
	}
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the product %s does not exist", id)
	}

	// Retrieve the existing product
	existingProductJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read existing product from world state: %v", err)
	}
	var existingProduct Product
	err = json.Unmarshal(existingProductJSON, &existingProduct)
	if err != nil {
		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
	}

	// Check if the product is already accepted
	if existingProduct.Status == "Accepted" {
		return fmt.Errorf("the product %s is already accepted", id)
	}
	// Check if the product is already delivered
	if existingProduct.Status == "Delivered" {
		return fmt.Errorf("the product %s is already delivered", id)
	}

	// Update the product status to "Accepted"
	existingProduct.Status = "Accepted"

	// Marshal the updated product
	updatedProductJSON, err := json.Marshal(existingProduct)
	if err != nil {
		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
	}

	// Put the updated product back to the world state
	err = ctx.GetStub().PutState(id, updatedProductJSON)
	if err != nil {
		return fmt.Errorf("failed to update product in world state: %v", err)
	}

	return nil
}

// ProductShip updates the status of a product to mark it as shipped by the manufacturer
func (s *SmartContract) ProductShip(ctx contractapi.TransactionContextInterface, id string, modifieddate string) error {
	// Check the invoking client's organization
	clientOrg, err := getClientOrganization(ctx)
	if err != nil {
		return err
	}

	// Only allow peers in Org1 to execute this function (assuming manufacturer is in Org1)
	if clientOrg != "Org1MSP" {
		return errors.New("Access denied: Only peers in Org1 are allowed to execute ProductShip")
	}
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the product %s does not exist", id)
	}

	// Retrieve the existing product
	existingProductJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read existing product from world state: %v", err)
	}
	var existingProduct Product
	err = json.Unmarshal(existingProductJSON, &existingProduct)
	if err != nil {
		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
	}

	// Check if the product is already shipped
	if existingProduct.Status == "Shipped" {
		return fmt.Errorf("the product %s is already shipped", id)
	}
	// Check if the product is already delivered
	if existingProduct.Status == "Delivered" {
		return fmt.Errorf("the product %s is already delivered", id)
	}

	// Update the product status to "Shipped"
	existingProduct.Status = "Shipped"
	existingProduct.ModifiedDate = modifieddate

	// Marshal the updated product
	updatedProductJSON, err := json.Marshal(existingProduct)
	if err != nil {
		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
	}

	// Put the updated product back to the world state
	err = ctx.GetStub().PutState(id, updatedProductJSON)
	if err != nil {
		return fmt.Errorf("failed to update product in world state: %v", err)
	}

	return nil
}

// ReadProduct returns the product information stored in the world state with the given ID
func (s *SmartContract) ReadProduct(ctx contractapi.TransactionContextInterface, id string) (*Product, error) {
	// Check if the product exists
	exists, err := s.ProductExists(ctx, id)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, fmt.Errorf("the product %s does not exist", id)
	}

	// Retrieve the product from the world state
	productJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read product from world state: %v", err)
	}

	// Unmarshal the product JSON into a Product struct
	var product Product
	err = json.Unmarshal(productJSON, &product)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal product JSON: %v", err)
	}

	return &product, nil
}

func (s *SmartContract) GetConsumerOrderedProductList(ctx contractapi.TransactionContextInterface, userName string) ([]*Product, error) {
    // Range query with an empty string for startKey and endKey retrieves all products in the chaincode namespace.
    resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
    if err != nil {
        return nil, fmt.Errorf("failed to get state by range: %v", err)
    }
    defer resultsIterator.Close()

    var products []*Product
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("error iterating over query results: %v", err)
        }

        var product Product
        err = json.Unmarshal(queryResponse.Value, &product)
        if err != nil {
            return nil, fmt.Errorf("error unmarshalling product JSON: %v", err)
        }

        // Check if the product's Status matches the given parameter
        // and if the product belongs to the current user
        if product.Consumer == userName {
            products = append(products, &product)
        }
    }

    return products, nil
}

func (s *SmartContract) GetOrderRequestedProductList(ctx contractapi.TransactionContextInterface, userName string) ([]*Product, error) {
    // Range query with an empty string for startKey and endKey retrieves all products in the chaincode namespace.
    resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
    if err != nil {
        return nil, fmt.Errorf("failed to get state by range: %v", err)
    }
    defer resultsIterator.Close()

    var products []*Product
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("error iterating over query results: %v", err)
        }

        var product Product
        err = json.Unmarshal(queryResponse.Value, &product)
        if err != nil {
            return nil, fmt.Errorf("error unmarshalling product JSON: %v", err)
        }

        // Check if the product's Status matches the given parameter
        // and if the product belongs to the current user
        if product.Status == "Pending Order Request" && product.Manufacturer == userName {
            products = append(products, &product)
        }
    }

    return products, nil
}

// GetProductStatus returns the current status of a specific product
func (s *SmartContract) GetProductStatus(ctx contractapi.TransactionContextInterface, id string) (string, error) {
    // Check if the product exists
    exists, err := s.ProductExists(ctx, id)
    if err != nil {
        return "", err
    }
    if !exists {
        return "", fmt.Errorf("the product %s does not exist", id)
    }

    // Retrieve the product from the world state
    productJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return "", fmt.Errorf("failed to read product from world state: %v", err)
    }

    // Unmarshal the product JSON into a Product struct
    var product Product
    err = json.Unmarshal(productJSON, &product)
    if err != nil {
        return "", fmt.Errorf("failed to unmarshal product JSON: %v", err)
    }

    // Return the current status of the product
    return product.Status, nil
}

// VerifyProductAuthenticity verifies the authenticity of a product using its unique identifier
func (s *SmartContract) VerifyProductAuthenticity(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
    // Retrieve the product from the world state using its ID
    productJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return false, fmt.Errorf("failed to read product from world state: %v", err)
    }

    // Check if the product exists
    if productJSON == nil {
        return false, nil // Product not found
    }

    // Unmarshal the product JSON into a Product struct
    var product Product
    err = json.Unmarshal(productJSON, &product)
    if err != nil {
        return false, fmt.Errorf("failed to unmarshal product JSON: %v", err)
    }

    // Perform additional checks to verify the authenticity of the product, if needed
    // For example, compare the retrieved data with expected information about the product

    // Return true if the product is authentic, false otherwise
    return true, nil
}

func getClientOrganization(ctx contractapi.TransactionContextInterface) (string, error) {
	clientIdentity, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return "", err
	}
	return clientIdentity, nil
}

func (s *SmartContract) TrackProductHistory(ctx contractapi.TransactionContextInterface, id string) ([]Product, error) {
	var productHistory []Product

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read product history: %v", err)
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate history results: %v", err)
		}

		var product Product
		if err := json.Unmarshal(response.Value, &product); err != nil {
			return nil, fmt.Errorf("failed to unmarshal product JSON: %v", err)
		}

		productHistory = append(productHistory, product)
	}

	return productHistory, nil
}

// package chaincode

// import (
// 	"encoding/json"
// 	"errors"
// 	"fmt"

// 	"github.com/hyperledger/fabric-contract-api-go/contractapi"
// )

// // SmartContract provides functions for managing an Asset
// type SmartContract struct {
// 	contractapi.Contract
// }

// // Asset describes basic details of what makes up a simple asset
// // Insert struct field in alphabetic order => to achieve determinism across languages
// // golang keeps the order when marshal to json but doesn't order automatically
// type Product struct {
// 	ID          string `json:"ID"`
// 	Name        string `json:"Name"`
// 	Description string `json:"Description"`
// 	Status      string `json:"Status"` // Status can be "Created", "Ordered", "Delivered", etc.
// 	Owner       string `json:"Owner"`
// }

// // InitLedger adds a base set of assets to the ledger
// func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
// 	// Check the invoking client's organization
// 	clientOrg, err := getClientOrganization(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	// Only allow peers in Org1 to execute this function
// 	if clientOrg != "Org1MSP" {
// 		return errors.New("Access denied: Only peers in Org1 are allowed to execute InitLedger")
// 	}

// 	assets := []Product{
// 		{ID: "1", Name: "apple", Description: "good", Status: "Created", Owner: "null"},
// 		{ID: "2", Name: "orange", Description: "good", Status: "Created", Owner: "null"},
// 	}

// 	for _, asset := range assets {
// 		assetJSON, err := json.Marshal(asset)
// 		if err != nil {
// 			return err
// 		}

// 		err = ctx.GetStub().PutState(asset.ID, assetJSON)
// 		if err != nil {
// 			return fmt.Errorf("failed to put to world state. %v", err)
// 		}
// 	}

// 	return nil
// }

// // ProductExists checks if a product with the given ID exists in the world state
// func (s *SmartContract) ProductExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
// 	productJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return false, fmt.Errorf("failed to read from world state: %v", err)
// 	}

// 	return productJSON != nil, nil
// }

// func (s *SmartContract) CreateProduct(ctx contractapi.TransactionContextInterface, id string, name string, description string) error {
// 	// Check the invoking client's organization
// 	clientOrg, err := getClientOrganization(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	// Only allow peers in Org1 to execute this function
// 	if clientOrg != "Org1MSP" {
// 		return errors.New("Access denied: Only peers in Org1 are allowed to execute CreateProduct")
// 	}
// 	exists, err := s.ProductExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if exists {
// 		return fmt.Errorf("the product %s already exists", id)
// 	}

// 	product := Product{
// 		ID:          id,
// 		Name:        name,
// 		Description: description,
// 		Status:      "Created",
// 		Owner:       "null",
// 	}
// 	productJSON, err := json.Marshal(product)
// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, productJSON)
// }

// //Create Product with specific user id 
// func (s *SmartContract) CreateProductWithUser(ctx contractapi.TransactionContextInterface, id string, name string, description string, userID string) error {
// 	// Check the invoking client's organization
// 	clientOrg, err := getClientOrganization(ctx)
	
// 	if err != nil {
// 		return err
// 	}

// 	// Only allow peers in Org1 to execute this function
// 	if clientOrg != "Org1MSP" {
// 		return errors.New("Access denied: Only peers in Org1 are allowed to execute CreateProductWithUser")
// 	}

// 	// Additional validation if needed for specific user from Org1
// 	// For example, you can check if the userID matches certain criteria or is valid.

// 	exists, err := s.ProductExists(ctx, id)

// 	if err != nil {
// 		return err
// 	}

// 	if exists {
// 		return fmt.Errorf("the product %s already exists", id)
// 	}

// 	product := Product{
// 		ID:          id,
// 		Name:        name,
// 		Description: description,
// 		Status:      "Created",
// 		Owner:       userID, // Assign specific user ID as the owner
// 	}

// 	productJSON, err := json.Marshal(product)

// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, productJSON)
// }


// // GetAllProducts returns all products stored in the world state
// func (s *SmartContract) GetAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
// 	// Range query with an empty string for startKey and endKey retrieves all products in the chaincode namespace.
// 	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to get state by range: %v", err)
// 	}
// 	defer resultsIterator.Close()

// 	var products []*Product
// 	for resultsIterator.HasNext() {
// 		queryResponse, err := resultsIterator.Next()
// 		if err != nil {
// 			return nil, fmt.Errorf("error iterating over query results: %v", err)
// 		}

// 		var product Product
// 		err = json.Unmarshal(queryResponse.Value, &product)
// 		if err != nil {
// 			return nil, fmt.Errorf("error unmarshalling product JSON: %v", err)
// 		}
// 		products = append(products, &product)
// 	}

// 	return products, nil
// }

// func (s *SmartContract) UpdateProduct(ctx contractapi.TransactionContextInterface, id string, name string, description string) error {
// 	// Check the invoking client's organization
// 	clientOrg, err := getClientOrganization(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	// Only allow peers in Org1 to execute this function
// 	if clientOrg != "Org1MSP" {
// 		return errors.New("Access denied: Only peers in Org1 are allowed to execute UpdateProduct")
// 	}
// 	exists, err := s.ProductExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the product %s does not exist", id)
// 	}

// 	// Retrieve the existing product
// 	existingProductJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return fmt.Errorf("failed to read existing product from world state: %v", err)
// 	}
// 	var existingProduct Product
// 	err = json.Unmarshal(existingProductJSON, &existingProduct)
// 	if err != nil {
// 		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
// 	}

// 	// Update the product attributes
// 	existingProduct.Name = name
// 	existingProduct.Description = description
// 	existingProduct.Owner = "null"

// 	// Marshal the updated product
// 	updatedProductJSON, err := json.Marshal(existingProduct)
// 	if err != nil {
// 		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
// 	}

// 	// Put the updated product back to the world state
// 	err = ctx.GetStub().PutState(id, updatedProductJSON)
// 	if err != nil {
// 		return fmt.Errorf("failed to update product in world state: %v", err)
// 	}

// 	return nil
// }

// // ProductOrder updates the status and owner of a product to mark it as ordered
// func (s *SmartContract) ProductOrder(ctx contractapi.TransactionContextInterface, id string, newOwner string) error {
// 	// Check the invoking client's organization
// 	clientOrg, err := getClientOrganization(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	// Only allow peers in Org2 to execute this function
// 	if clientOrg != "Org2MSP" {
// 		return errors.New("Access denied: Only peers in Org2 are allowed to execute ProductOrder")
// 	}
// 	exists, err := s.ProductExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the product %s does not exist", id)
// 	}

// 	// Retrieve the existing product
// 	existingProductJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return fmt.Errorf("failed to read existing product from world state: %v", err)
// 	}
// 	var existingProduct Product
// 	err = json.Unmarshal(existingProductJSON, &existingProduct)
// 	if err != nil {
// 		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
// 	}
// 	// Check if the product is already ordered
// 	if existingProduct.Status == "Ordered" {
// 		return fmt.Errorf("the product %s is already ordered", id)
// 	}
// 	// Check if the product is already delivered
// 	if existingProduct.Status == "Delivered" {
// 		return fmt.Errorf("the product %s is already delivered", id)
// 	}

// 	// Update the product status and owner
// 	existingProduct.Status = "Ordered"
// 	existingProduct.Owner = newOwner

// 	// Marshal the updated product
// 	updatedProductJSON, err := json.Marshal(existingProduct)
// 	if err != nil {
// 		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
// 	}

// 	// Put the updated product back to the world state
// 	err = ctx.GetStub().PutState(id, updatedProductJSON)
// 	if err != nil {
// 		return fmt.Errorf("failed to update product in world state: %v", err)
// 	}

// 	return nil
// }

// func (s *SmartContract) ProductDeliver(ctx contractapi.TransactionContextInterface, id string) error {
// 	// Check the invoking client's organization
// 	clientOrg, err := getClientOrganization(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	// Only allow peers in Org1 to execute this function
// 	if clientOrg != "Org1MSP" {
// 		return errors.New("Access denied: Only peers in Org1 are allowed to execute ProductDeliver")
// 	}
// 	exists, err := s.ProductExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the product %s does not exist", id)
// 	}

// 	// Retrieve the existing product
// 	existingProductJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return fmt.Errorf("failed to read existing product from world state: %v", err)
// 	}
// 	var existingProduct Product
// 	err = json.Unmarshal(existingProductJSON, &existingProduct)
// 	if err != nil {
// 		return fmt.Errorf("failed to unmarshal existing product JSON: %v", err)
// 	}

// 	if existingProduct.Status != "Ordered" {
// 		return fmt.Errorf("the product %s has not been ordered or has already delivered", id)
// 	}

// 	existingProduct.Status = "Delivered"

// 	// Marshal the updated product
// 	updatedProductJSON, err := json.Marshal(existingProduct)
// 	if err != nil {
// 		return fmt.Errorf("failed to marshal updated product JSON: %v", err)
// 	}

// 	// Put the updated product back to the world state
// 	err = ctx.GetStub().PutState(id, updatedProductJSON)
// 	if err != nil {
// 		return fmt.Errorf("failed to update product in world state: %v", err)
// 	}

// 	return nil
// }

// // ReadProduct returns the product information stored in the world state with the given ID
// func (s *SmartContract) ReadProduct(ctx contractapi.TransactionContextInterface, id string) (*Product, error) {
// 	// Check if the product exists
// 	exists, err := s.ProductExists(ctx, id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	if !exists {
// 		return nil, fmt.Errorf("the product %s does not exist", id)
// 	}

// 	// Retrieve the product from the world state
// 	productJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to read product from world state: %v", err)
// 	}

// 	// Unmarshal the product JSON into a Product struct
// 	var product Product
// 	err = json.Unmarshal(productJSON, &product)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to unmarshal product JSON: %v", err)
// 	}

// 	return &product, nil
// }

// func getClientOrganization(ctx contractapi.TransactionContextInterface) (string, error) {
// 	clientIdentity, err := ctx.GetClientIdentity().GetMSPID()
// 	if err != nil {
// 		return "", err
// 	}
// 	return clientIdentity, nil
// }

// func (s *SmartContract) TrackProductHistory(ctx contractapi.TransactionContextInterface, id string) ([]Product, error) {
//     var productHistory []Product

//     resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
//     if err != nil {
//         return nil, fmt.Errorf("failed to read product history: %v", err)
//     }
//     defer resultsIterator.Close()

//     for resultsIterator.HasNext() {
//         response, err := resultsIterator.Next()
//         if err != nil {
//             return nil, fmt.Errorf("failed to iterate history results: %v", err)
//         }

//         var product Product
//         if err := json.Unmarshal(response.Value, &product); err != nil {
//             return nil, fmt.Errorf("failed to unmarshal product JSON: %v", err)
//         }

//         productHistory = append(productHistory, product)
//     }

//     return productHistory, nil
// }
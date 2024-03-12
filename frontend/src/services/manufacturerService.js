import httpService from "./httpService";
const apiEndpoint = "createProduct";

function createProduct(data) {
  return httpService.post(apiEndpoint, data);
}

function updateProduct(data) {
  return httpService
    .post("updateProduct", data)
    .then((response) => {
      // Handle successful response if needed
      return response.data; // Return data if needed
    })
    .catch((error) => {
      // Extract and return error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error is from the server and contains a message
        return Promise.reject(error.response.data.message);
      } else if (error.message) {
        // If the error has a message property
        return Promise.reject(error.message);
      } else {
        // Default error message
        return Promise.reject("An unknown error occurred.");
      }
    });
}

// function sellToConsumer(productId, consumerId, privateKey) {
//   let userName = localStorage.getItem("username");
//   let orgName = localStorage.getItem("orgName");
//   return httpService.post("", {
//     privateKey,
//     userName,
//     orgName,
//     productId,
//     consumerId,
//   });
// }

function getProductList() {
  let userName = localStorage.getItem("username");
  return httpService.post("getProductListByManufacturerID", {
    userName,
  });
}

function getRequestedProductOrderList() {
  let userName = localStorage.getItem("username");
  return httpService
    .post("getOrderRequestedProductList", {
      userName,
    })
    .then((response) => {
      // Handle successful response if needed
      return response.data; // Return data if needed
    })
    .catch((error) => {
      // Extract and return error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error is from the server and contains a message
        return Promise.reject(error.response.data.message);
      } else if (error.message) {
        // If the error has a message property
        return Promise.reject(error.message);
      } else {
        // Default error message
        return Promise.reject("An unknown error occurred.");
      }
    });
}

function getProductByToken(token) {
  return httpService.get(`readProduct/${token}`);
}

function getProductTransactionByToken(token) {
  return httpService.get(`getProductHistory/${token}`);
}

function acceptProductOrder(token) {
  let userName = localStorage.getItem("username");
  return httpService
    .post("acceptProductOrder", {
      userName,
      token,
    })
    .then((response) => {
      // Handle successful response if needed
      return response.data; // Return data if needed
    })
    .catch((error) => {
      // Extract and return error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error is from the server and contains a message
        return Promise.reject(error.response.data.message);
      } else if (error.message) {
        // If the error has a message property
        return Promise.reject(error.message);
      } else {
        // Default error message
        return Promise.reject("An unknown error occurred.");
      }
    });
}

function shipProductOrder(token) {
  return httpService
    .post("shipProductOrder", {
      token,
    })
    .then((response) => {
      // Handle successful response if needed
      return response.data; // Return data if needed
    })
    .catch((error) => {
      // Extract and return error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error is from the server and contains a message
        return Promise.reject(error.response.data.message);
      } else if (error.message) {
        // If the error has a message property
        return Promise.reject(error.message);
      } else {
        // Default error message
        return Promise.reject("An unknown error occurred.");
      }
    });
}

function deliverProductOrder(token) {
  let userName = localStorage.getItem("username");
  return httpService
    .post("deliverProductOrder", {
      userName,
      token,
    })
    .then((response) => {
      // Handle successful response if needed
      return response.data; // Return data if needed
    })
    .catch((error) => {
      // Extract and return error message
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error is from the server and contains a message
        return Promise.reject(error.response.data.message);
      } else if (error.message) {
        // If the error has a message property
        return Promise.reject(error.message);
      } else {
        // Default error message
        return Promise.reject("An unknown error occurred.");
      }
    });
}

const ManufacturerService = {
  createProduct,
  updateProduct,
  getProductByToken,
  getProductList,
  getProductTransactionByToken,
  getRequestedProductOrderList,
  acceptProductOrder,
  shipProductOrder,
  deliverProductOrder,
};

export default ManufacturerService;

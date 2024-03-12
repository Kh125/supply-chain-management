import httpService from "./httpService";

function getProductListByConsumer() {
  // let userName = localStorage.getItem("username");
  return httpService.get("getAllProducts");
}

function orderProduct(data) {
  return httpService
    .post("orderProduct", data)
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

function getConsumerProductOrderList() {
  let userName = localStorage.getItem("username");
  return httpService
    .post("getConsumerProductOrderList", {
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

const ConsumerService = {
  getProductListByConsumer,
  orderProduct,
  getConsumerProductOrderList,
};

export default ConsumerService;

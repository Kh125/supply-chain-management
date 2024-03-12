import React, { useState, useEffect } from "react";
import Loader from "../../common/loader";
import ManufacturerService from "../../services/manufacturerService";
import { Link } from "react-router-dom";

function ProductList() {
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setLoader(true);
        const res = await ManufacturerService.getProductList();
        setLoader(false);
        if (res.data["success"]) {
          setShow(true);
          setData(res.data["data"]);
          console.log(res.data["success"]);
        } else {
          setError(res.data["message"]);
        }
      } catch (error) {
        console.log(error);
        setError("Something went wrong!");
      }
    };

    sendRequest();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const generateColorClass = (status) => {
    let color = "text-yellow-500";

    switch (status) {
      case "Accepted":
        color = "text-green-500";
        break;
      case "Shipped":
        color = "text-blue-500";
        break;
      case "Delivered":
        color = "text-gray-500";
        break;
      case "Pending Order Request":
      default:
        color = "text-yellow-500";
    }

    return color;
  };

  const columnNames = [
    // "Token Id",
    "Product Name",
    "Product Description",
    "Price",
    "Manufacturer",
    "Status",
    "Created Date",
    "Action",
  ];

  const TableData = ({ data }) => {
    return (
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex">
          <div className="ml-4">
            <div className="text-sm text-left font-medium text-gray-900">
              {data}
            </div>
          </div>
        </div>
      </td>
    );
  };

  return (
    <>
      {show && (
        <div className="container my-12 px-6 mx-auto">
          <section className="mb-32 text-center">
            <div className="mx-auto px-3 lg:px-6">
              <h2 className="text-left text-3xl font-bold mb-12">
                Product List
              </h2>

              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {columnNames.map((column, index) => {
                              return (
                                <th
                                  key={index}
                                  scope="col"
                                  className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {column}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data.map((item, index) => (
                            <tr key={index} className="w-16">
                              {/* <td className="px-3 py-4 w-9">
                                <div className="text-sm text-left font-medium text-gray-900">
                                  {item.ID}
                                </div>
                              </td> */}
                              <TableData data={item.Name} />
                              <TableData data={item.Description} />
                              <TableData data={item.Price} />
                              <TableData data={item.Manufacturer} />
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex">
                                  <div className="ml-4">
                                    <div
                                      className={`${generateColorClass(
                                        item.Status
                                      )} "text-sm text-left font-medium"`}
                                    >
                                      {item.Status}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <TableData data={item.CreatedDate} />
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex">
                                  <div className="ml-4">
                                    <div className="text-sm text-left font-medium text-gray-900">
                                      <Link
                                        to={`/product-info/${item.ID}`}
                                        className="underline text-blue-500"
                                      >
                                        View More
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center my-10 text-lg font-semibold">
          {error}
        </div>
      )}
      {loader && (
        <div className="mt-5">
          <Loader />
        </div>
      )}
    </>
  );
}

export default ProductList;

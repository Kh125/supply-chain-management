/** Ledger product statuses from chaincode */
export const STATUS = {
  PENDING: "Pending",
  PENDING_ORDER: "Pending Order Request",
  ACCEPTED: "Accepted",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export function getStatusColorClass(status) {
  switch (status) {
    case STATUS.ACCEPTED:
      return "text-green-600 font-medium";
    case STATUS.SHIPPED:
      return "text-blue-600 font-medium";
    case STATUS.DELIVERED:
      return "text-gray-600 font-medium";
    case STATUS.PENDING_ORDER:
      return "text-amber-600 font-medium";
    case STATUS.PENDING:
    default:
      return "text-yellow-600 font-medium";
  }
}

export function formatConsumer(consumer) {
  if (!consumer || consumer === "null") return null;
  return consumer;
}

export function getShippingSteps(status) {
  const progressIndex = {
    [STATUS.PENDING]: -1,
    [STATUS.PENDING_ORDER]: 0,
    [STATUS.ACCEPTED]: 1,
    [STATUS.SHIPPED]: 2,
    [STATUS.DELIVERED]: 3,
  }[status] ?? -1;

  const stateFor = (doneFrom, currentAt) => {
    if (progressIndex >= doneFrom) return "done";
    if (progressIndex === currentAt) return "current";
    return "upcoming";
  };

  return [
    {
      label:
        status === STATUS.PENDING_ORDER ? "Order requested" : "Order accepted",
      state: stateFor(1, 0),
    },
    {
      label: "Shipped",
      state: stateFor(2, 1),
    },
    {
      label: "Delivered",
      state: stateFor(3, 2),
    },
  ];
}

export function canConsumerOrder(status) {
  return status === STATUS.PENDING;
}

export function canManufacturerUpdate(status) {
  return status === STATUS.PENDING;
}

export function canManufacturerAccept(status) {
  return status === STATUS.PENDING_ORDER;
}

export function canManufacturerShip(status) {
  return status === STATUS.ACCEPTED;
}

export function canManufacturerDeliver(status) {
  return status === STATUS.SHIPPED;
}

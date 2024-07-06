import { useOutletContext } from "react-router-dom";

const filterOrders = (order) => {
    const { filter } = useOutletContext();
    if (filter === 'recent') {
      return true; // Show all orders
    } else if (filter === 'delivered') {
      return order.items.some(item => item.status === 'Delivered');
    } else if (filter === 'cancelled') {
      return order.items.some(item => item.status === 'Cancelled');
    } else if (filter === 'ongoing') {
      return order.items.every(item => item.status !== 'Delivered' && item.status !== 'Cancelled');
    }
    return true; // Default to show all orders
};

export default filterOrders;
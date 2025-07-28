import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { food_list as local_food_list } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-backend-x3jz.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]); // Start with empty

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const response=await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
      if(response.data.success){
        toast.success("item Added to Cart")
      }else{
        toast.error("Something went wrong")
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      const response= await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
      if(response.data.success){
        toast.success("item Removed from Cart")
      }else{
        toast.error("Something went wrong")
      }
    }
  };

  const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      let itemInfo = food_list.find((product) => product._id === item);
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
  return totalAmount;
};


  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(url + "/api/food/list");
        if (res.data.success && res.data.data.length > 0) {
          // Combine backend and static foods (avoid duplicates by _id)
          const backendIds = new Set(res.data.data.map(item => item._id));
          const combined = [
            ...res.data.data,
            ...local_food_list.filter(item => !backendIds.has(item._id))
          ];
          setFoodList(combined);
        } else {
          setFoodList(local_food_list);
        }
      } catch (e) {
        setFoodList(local_food_list);
      }
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;

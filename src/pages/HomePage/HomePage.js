import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.scss";
import { useMealContext } from "../../context/mealContext";
import Loader from "../../components/Loader/Loader";
import CategoryList from "../../components/Category/CategoryList";
import NotFound from "../../components/NotFound/NotFound";
import MealList from "../../components/Meal/MealList";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

const HomePage = () => {
  const { categories, meals, categoryLoading, mealsLoading } = useMealContext();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
      } else {
        navigate("/login");

        console.log("user is logged out");
      }
    });
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <main className="main-content">
        {mealsLoading ? (
          <Loader />
        ) : meals === null ? (
          <NotFound />
        ) : meals?.length ? (
          <MealList meals={meals} />
        ) : (
          ""
        )}
        {categoryLoading ? (
          <Loader />
        ) : (
          <CategoryList categories={categories} />
        )}
      </main>
    </>
  );
};

export default HomePage;

import React, { useEffect } from "react";
import "./CategoryPage.scss";
import { useMealContext } from "../../context/mealContext";
import MealList from "../../components/Meal/MealList";
import { useParams } from "react-router-dom";
import { startFetchMealByCategory } from "../../actions/mealsActions";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

const CategoryPage = () => {
  const { name } = useParams();
  const { categoryMeals, dispatch, categories } = useMealContext();
  let catDescription = "";

  if (categories) {
    categories.forEach((category) => {
      if (category?.strCategory === name)
        catDescription = category?.strCategoryDescription;
    });
  }

  useEffect(() => {
    startFetchMealByCategory(dispatch, name);
  }, [name, dispatch]);

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
      <main className="main-content py-5">
        <div className="container">
          <div className="cat-description px-4 py-4">
            <h2 className="text-orange fw-8">{name}</h2>
            <p className="fs-18 op-07">{catDescription}</p>
          </div>
        </div>
        {categoryMeals?.length ? <MealList meals={categoryMeals} /> : null}
      </main>
    </>
  );
};

export default CategoryPage;

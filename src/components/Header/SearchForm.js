import React, { useState, useEffect } from "react";
import "./Header.scss";
import { BsSearch } from "react-icons/bs";
import { useMealContext } from "../../context/mealContext";
import { useNavigate } from "react-router-dom";
import { startFetchMealsBySearch } from "../../actions/mealsActions";
import {
  saveSearchHistory,
  getSearchHistoryByUserId,
} from "../../utils/firebase";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const SearchForm = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { dispatch, meals } = useMealContext();

  const handleSearchTerm = (e) => {
    e.preventDefault();
    if (e.target.value.replace(/[^\w\s]/gi, "").length !== 0) {
      setSearchTerm(e.target.value);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid search term ...");
    }
  };

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("uid", user.uid);
      } else {
        setCurrentUser(null);
        navigate("/login");
        console.log("user is logged out");
      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const handleSearchResult = (e) => {
    e.preventDefault();
    navigate("/");
    startFetchMealsBySearch(dispatch, searchTerm);
    saveSearchHistory(searchTerm, currentUser?.uid); // Menggunakan currentUser.uid
    console.log("userid: " + currentUser?.uid);
    setShowSearchHistory(false);
  };

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
      getSearchHistoryByUserId(currentUser.uid).then((history) => {
        setSearchHistory(history);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // Fungsi untuk menutup riwayat pencarian
    const closeSearchHistory = (e) => {
      if (
        !document.querySelector(".search-form-container").contains(e.target)
      ) {
        setShowSearchHistory(false);
      }
    };

    // Tambahkan event listener ke document
    document.addEventListener("mousedown", closeSearchHistory);

    // Cleanup: hapus event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", closeSearchHistory);
    };
  }, []);

  const handleHistoryClick = (term) => {
    // Setel input dengan kata kunci yang diklik
    setSearchTerm(term);

    // Jalankan pencarian dengan kata kunci tersebut
    startFetchMealsBySearch(dispatch, term);

    // Simpan ke database jika perlu, Anda dapat menyesuaikannya sesuai kebutuhan
    if (currentUser?.uid) {
      saveSearchHistory(term, currentUser.uid);
    }

    // Tutup riwayat pencarian
    setShowSearchHistory(false);
  };

  return (
    <div className="search-form-container">
      <form
        className="search-form flex align-center"
        onSubmit={(e) => handleSearchResult(e)}
      >
        <input
          type="text"
          className="form-control-input text-dark-gray fs-15"
          placeholder="Search recipes here ..."
          onClick={() => setShowSearchHistory(true)} // Tampilkan riwayat pencarian saat input diklik
          onChange={(e) => handleSearchTerm(e)}
        />
        <button
          type="submit"
          className="form-submit-btn text-white text-uppercase fs-14"
        >
          <BsSearch className="btn-icon" size={20} />
        </button>
      </form>

      {showSearchHistory && (
        <div className="search-history">
          <h3>Your Search History</h3>
          {searchHistory.map((item, index) => (
            <p
              key={index}
              onClick={() => handleHistoryClick(item.searchTerm)} // Tambahkan event listener untuk menangani klik
            >
              {item.searchTerm}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchForm;

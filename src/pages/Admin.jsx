import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Admin() {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    rid: "",
    name: "",
    image: "",
    time: "",
    cuisine: "",
    mealType: "",
    ingredients: "",
    process: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/adminlogin");
    } else {
      fetchRecipes();
      setCheckingAdmin(false);
    }
  }, []);

  const fetchRecipes = () => {
    axios
      .get("http://54.210.110.125:8080/recipe")
      .then((res) => {
        setRecipes(res.data);
        setFilteredRecipes(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const request = isUpdating
      ? axios.put("http://54.210.110.125:8080/update", formData)
      : axios.post("http://54.210.110.125:8080/insert", formData);

    request
      .then((res) => {
        alert(res.data);
        resetForm();
        fetchRecipes();
      })
      .catch((err) => console.error(err));
  };

  const resetForm = () => {
    setFormData({
      rid: "",
      name: "",
      image: "",
      time: "",
      cuisine: "",
      mealType: "",
      ingredients: "",
      process: "",
    });
    setIsUpdating(false);
  };

  const handleEdit = (recipe) => {
    setFormData(recipe);
    setIsUpdating(true);
  };

  const handleDelete = (rid) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      axios
        .delete(`http://54.210.110.125:8080/delete`, { params: { rid } })
        .then((res) => {
          alert(res.data);
          fetchRecipes();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleCuisineChange = (e) => {
    setSelectedCuisine(e.target.value);
    filterRecipes(e.target.value, selectedMealType);
  };

  const handleMealTypeChange = (e) => {
    setSelectedMealType(e.target.value);
    filterRecipes(selectedCuisine, e.target.value);
  };

  const filterRecipes = (cuisine, mealType) => {
    let filtered = recipes;
    if (cuisine) {
      filtered = filtered.filter((r) => r.cuisine === cuisine);
    }
    if (mealType) {
      filtered = filtered.filter((r) => r.mealType === mealType);
    }
    setFilteredRecipes(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  if (checkingAdmin) return <div>Loading...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundImage:
          "url('https://png.pngtree.com/background/20210711/original/pngtree-light-color-antique-simple-food-miso-noodles-e-commerce-banner-picture-image_1118205.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logout Link */}
     <div
     onClick={handleLogout}
     style={{
      width: "fit-content",
      marginLeft: "auto",
      marginRight: "100px",
      marginTop: "20px",
      cursor: "pointer",
      padding: "5px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px", // space between icon and text
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
      title="Logout"
      >
        <LogOut size={28} color="#8B4513" />
        <span style={{ fontSize: "16px", color: "#8B4513", fontWeight: "bold" }}>Logout</span>
        </div>

      <div style={{ display: "flex", width: "100%", flexGrow: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "250px",
            height: "50vh",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(8px)", // Added blur effect
            padding: "20px",
            boxSizing: "border-box",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>
              Filter Recipes
            </h3>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Cuisine:</label>
              <select
                value={selectedCuisine}
                onChange={handleCuisineChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <option value="">All</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="American">American</option>
                <option value="French">French</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Meal Type:</label>
              <select
                value={selectedMealType}
                onChange={handleMealTypeChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "5px",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <option value="">All</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <p
              onClick={() => navigate("/home")}
              style={{
                fontSize: "16px",
                color: "#8B4513",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "500",
                transition: "color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#A0522D")}
              onMouseOut={(e) => (e.target.style.color = "#8B4513")}
            >
              ⬅ Go to Dashboard
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(2px)", // Added blur effect
            borderRadius: "10px",
            marginLeft: "20px",
          }}
        >
          <h2 style={{ color: "#333" }}>Admin Recipe Management</h2>

          {/* Form */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="number"
              name="rid"
              placeholder="Recipe ID"
              value={formData.rid}
              onChange={handleChange}
              style={{
                marginBottom: "10px",
                width: "48%",
                padding: "6px",
                borderRadius: "5px",
                backgroundColor: "#f7f7f7",
                marginRight: "2%",
              }}
            />
            <input
              type="text"
              name="name"
              placeholder="Recipe Name"
              value={formData.name}
              onChange={handleChange}
              style={{
                marginBottom: "10px",
                width: "48%",
                padding: "6px",
                borderRadius: "5px",
                backgroundColor: "#f7f7f7",
              }}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              style={{
                marginBottom: "10px",
                width: "48%",
                padding: "6px",
                borderRadius: "5px",
                backgroundColor: "#f7f7f7",
                marginRight: "2%",
              }}
            />
            <input
              type="text"
              name="time"
              placeholder="Time Taken"
              value={formData.time}
              onChange={handleChange}
              style={{
                marginBottom: "10px",
                width: "48%",
                padding: "6px",
                borderRadius: "5px",
                backgroundColor: "#f7f7f7",
              }}
            />

            <div style={{ marginBottom: "10px", width: "30%", marginRight: "2%" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Cuisine:</label>
              <select
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "6px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <option value="">Select Cuisine</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="American">American</option>
                <option value="French">French</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Meal Type:</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                style={{
                  width: "30%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <option value="">Select Meal Type</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <textarea
              name="ingredients"
              placeholder="Ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              style={{
                marginBottom: "10px",
                width: "75%",
                height: "80px",
                padding: "6px",
                borderRadius: "5px",
                backgroundColor: "#f7f7f7",
              }}
            ></textarea>
            <textarea
              name="process"
              placeholder="Process"
              value={formData.process}
              onChange={handleChange}
              style={{
                marginBottom: "10px",
                width: "75%",
                height: "80px",
                padding: "6px",
                borderRadius: "5px",
                backgroundColor: "#f7f7f7",
              }}
            ></textarea>

            <br />
            <button
              onClick={handleSubmit}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#4CAF50",
                color: "white",
              }}
            >
              {isUpdating ? "Update Recipe" : "Add Recipe"}
            </button>
          </div>

          {/* Table */}
          <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Time</th>
                <th>Cuisine</th>
                <th>Meal Type</th>
                <th>Ingredients</th>
                <th>Process</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.rid}>
                  <td>{recipe.rid}</td>
                  <td>{recipe.name}</td>
                  <td>
                    <img src={recipe.image} alt={recipe.name} width="80" />
                  </td>
                  <td>{recipe.time}</td>
                  <td>{recipe.cuisine}</td>
                  <td>{recipe.mealType}</td>
                  <td>{recipe.ingredients}</td>
                  <td>{recipe.process}</td>
                  <td>
                    <button onClick={() => handleEdit(recipe)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(recipe.rid)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

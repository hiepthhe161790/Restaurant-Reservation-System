import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  InputLabel,
  FormControl,
  NativeSelect,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useDeleteImageMutation,
  useGetImagesByEntityIdQuery,
  useUploadImageMutation,
} from "../../../redux/api/imageApi";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../../../firebase/firebase";

const category = ["MAIN_COURSE", "DESSERT", "BEVERAGE", "SALAD", "APPETIZER"];
const foodTag = ["SEASONAL", "HOT_SALE", "CHEF_SPECIAL"];

const DishForm = ({ dish, onSubmit, onClose, restaurants }) => {
  const [formData, setFormData] = useState({
    name: dish?.name || "",
    price: dish?.price || 0,
    category: dish?.category || "",
    description: dish?.description || "",
    foodTag: dish?.foodTag || "",
    restaurants: dish?.restaurants || [], // List of restaurant IDs associated with the dish
  });

  const handleAddRestaurant = (restaurantId) => {
    const restaurantToAdd = restaurants?.data?.find(
      (restaurant) => restaurant._id === restaurantId
    );
    if (restaurantToAdd) {
      setFormData((prevState) => ({
        ...prevState,
        restaurants: [...prevState.restaurants, restaurantToAdd],
      }));
    }
  };

  const handleRemoveRestaurant = (restaurantId) => {
    setFormData((prevState) => ({
      ...prevState,
      restaurants: prevState.restaurants.filter(
        (restaurant) => restaurant._id !== restaurantId
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Submit the dish data with associated restaurants
    onClose(); // Close the form after submission
  };

  const { data: images } = useGetImagesByEntityIdQuery(dish?._id, {
    skip: !dish, // Bỏ qua gọi API nếu dish là null
  });
  const [deleteImage] = useDeleteImageMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleImageChange = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + file.name);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Upload new image data to backend
        await uploadImage({
          url: downloadURL,
          altText: formData.name,
          entityId: dish ? dish._id : null,
          entityType: "DISH",
        });
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleDeleteImage = async (imageId, imageText) => {
    try {
      window.confirm(`Are you sure to delete image "${imageText}"?`);
      await deleteImage(imageId).unwrap();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dish ? "Cập nhật món ăn" : "Thêm món ăn mới"}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Dish Name */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />

          {/* Hình ảnh món ăn */}
          {dish && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Hình ảnh:</Typography>
                <Grid container spacing={1}>
                  {images?.data?.map((image) => (
                    <Grid item key={image._id}>
                      <img
                        src={image.url}
                        alt={image.altText}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginBottom: "8px",
                        }}
                      />
                      <IconButton
                        onClick={() =>
                          handleDeleteImage(image._id, image.altText)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
                <TextField
                  type="file"
                  fullWidth
                  onChange={handleImageChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </>
          )}

          {/* Price */}
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            margin="normal"
          />

          {/* Category */}
          <Box sx={{ maxWidth: 150 }} margin="normal">
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="category-select">
                Category
              </InputLabel>
              <NativeSelect
                id="category-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {category.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Box>

          {/* Food Tag */}
          <Box sx={{ maxWidth: 150 }} margin="normal">
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="foodTag-select">
                Food Tag
              </InputLabel>
              <NativeSelect
                id="foodTag-select"
                value={formData.foodTag}
                onChange={(e) =>
                  setFormData({ ...formData, foodTag: e.target.value })
                }
              >
                {foodTag.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Box>

          {/* Description */}
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
          />

          {/* Selected Restaurants */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Các cửa hàng có món ăn</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.restaurants.map((restaurant) => (
                  <TableRow key={restaurant._id}>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveRestaurant(restaurant._id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Available Restaurants */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Các cửa hàng chưa có món ăn</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {restaurants?.data
                  ?.filter(
                    (restaurant) =>
                      !formData.restaurants.some(
                        (r) => restaurant._id === r._id
                      )
                  )
                  .map((restaurant) => (
                    <TableRow key={restaurant._id}>
                      <TableCell>{restaurant.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddRestaurant(restaurant._id)}
                        >
                          Thêm
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          <Button type="submit" color="primary" variant="contained">
            {dish ? "Cập nhật món ăn" : "Thêm món ăn"}
          </Button>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Hủy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DishForm;

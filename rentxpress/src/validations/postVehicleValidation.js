import * as Yup from "yup";

const postVehicleValidation = Yup.object().shape({
  name: Yup.string()
    .required("Vehicle name is required")
    .min(2, "Vehicle name must be at least 2 characters")
    .max(100, "Vehicle name must be less than 100 characters"),
  
  price: Yup.number()
    .transform((value, originalValue) => {
      // Return undefined for empty strings so required validation kicks in
      return originalValue === "" ? undefined : value;
    })
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1")
    .max(1000000, "Price must be less than 1,000,000"),
  
  category: Yup.string()
    .required("Category is required")
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be less than 50 characters"),
  
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  
  image: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "File size must be less than 10MB", function(value) {
      if (!value) return true; // Let required validation handle empty values
      return value.size <= 10 * 1024 * 1024; // 10MB in bytes
    })
    .test("fileType", "Only PNG, JPG, and JPEG formats are allowed", function(value) {
      if (!value) return true; // Let required validation handle empty values
      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      return validTypes.includes(value.type);
    }),
});

export default postVehicleValidation;
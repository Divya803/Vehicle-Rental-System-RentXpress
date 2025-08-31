// import * as Yup from "yup";

// const verifyAccountValidation = Yup.object().shape({
//   firstName: Yup.string()
//     .required("First name is required")
//     .min(2, "First name must be at least 2 characters"),
//   lastName: Yup.string()
//     .required("Last name is required")
//     .min(2, "Last name must be at least 2 characters"),
//   age: Yup.number()
//     .transform((value, originalValue) => {
//       // Return undefined for empty strings so required validation kicks in
//       return originalValue === "" ? undefined : value;
//     })
//     .required("Age is required")
//     .positive("Age must be a positive number")
//     .integer("Age must be a whole number")
//     .min(18, "You must be at least 18 years old")
//     .max(100, "Age must be less than 100"),
//   phoneNo: Yup.string()
//     .required("Phone number is required")
//     .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
//   nic: Yup.string()
//     .required("NIC is required")
//     .matches(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, "Invalid NIC format"),
//   dateOfBirth: Yup.date()
//     .transform((value, originalValue) => {
//       // Return undefined for empty strings so required validation kicks in
//       return originalValue === "" ? undefined : value;
//     })
//     .required("Date of Birth is required")
//     .max(new Date(), "Date of Birth cannot be in the future")
//     .test('age-check', 'You must be at least 18 years old', function(value) {
//       if (!value) return true; // Let required validation handle empty values
//       const today = new Date();
//       const birthDate = new Date(value);
//       const age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();

//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         return age - 1 >= 18;
//       }
//       return age >= 18;
//     }),
//   role: Yup.string()
//     .required("Role is required")
//     .oneOf(["Driver", "Vehicle Owner"], "Invalid role selected"),
// });

// export default verifyAccountValidation;

import * as Yup from "yup";

const verifyAccountValidation = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  age: Yup.number()
    .transform((value, originalValue) => {
      // Return undefined for empty strings so required validation kicks in
      return originalValue === "" ? undefined : value;
    })
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(100, "Age must be less than 100"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  nic: Yup.string()
    .required("NIC is required")
    .matches(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, "Invalid NIC format"),
  dateOfBirth: Yup.date()
    .transform((value, originalValue) => {
      // Return undefined for empty strings so required validation kicks in
      return originalValue === "" ? undefined : value;
    })
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test('age-check', 'You must be at least 18 years old', function (value) {
      if (!value) return true; // Let required validation handle empty values
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  role: Yup.string()
    .required("Role is required")
    .oneOf(["Driver", "Vehicle Owner"], "Invalid role selected"),
  // Document validations
  nicDocument: Yup.mixed()
    .required("NIC document is required"),
  licenseDocument: Yup.mixed()
    .when("role", {
      is: "Driver",
      then: (schema) => schema.required("Driver's license document is required"),
      otherwise: (schema) => schema.nullable()
    }),
  vehicleRegistration: Yup.mixed()
    .when("role", {
      is: "Vehicle Owner",
      then: (schema) => schema.required("Vehicle registration document is required"),
      otherwise: (schema) => schema.nullable()
    }),
});

export default verifyAccountValidation;
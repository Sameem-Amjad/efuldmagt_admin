export function validateWelfareData(data) {
  const errors = [];

  data.forEach((item, index) => {
    const itemErrors = [];
    const {
      Name,
      Location,
      Latitude,
      Longitude,
      Description,
      PointOfContact,
      PhoneNumber,
      Email,
    } = item;

    // Validate Name
    if (!Name || typeof Name !== "string") {
      itemErrors.push("Name is required and must be a string.");
    }

    // Validate Location
    if (!Location || typeof Location !== "string") {
      itemErrors.push("Location is required and must be a string.");
    }

    // Validate Latitude
    if (!Latitude || isNaN(parseFloat(Latitude))) {
      itemErrors.push("Latitude is required and must be a valid number.");
    }

    // Validate Longitude
    if (!Longitude || isNaN(parseFloat(Longitude))) {
      itemErrors.push("Longitude is required and must be a valid number.");
    }

    // Validate Description
    if (!Description || typeof Description !== "string") {
      itemErrors.push("Description is required and must be a string.");
    }

    // Validate PointOfContact
    if (!PointOfContact || typeof PointOfContact !== "string") {
      itemErrors.push("PointOfContact is required and must be a string.");
    }

    // Validate PhoneNumber
    if (!PhoneNumber || !/^\+?\d{10,15}$/.test(PhoneNumber)) {
      itemErrors.push(
        "PhoneNumber is required and must be a valid international phone number."
      );
    }

    // Validate Email
    if (!Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      itemErrors.push("Email is required and must be a valid email address.");
    }

    // Collect errors for this item if any
    if (itemErrors.length > 0) {
      errors.push({ row: index + 1, errors: itemErrors });
    }
  });

  return errors.length > 0
    ? { isValid: false, errors }
    : { isValid: true, message: "All data is valid." };
}

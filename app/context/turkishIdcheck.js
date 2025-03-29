class TurkishIdentityValidation {
  constructor() {
    this.serviceUrl = "https://tckimlik.nvi.gov.tr/Service/";
  }

  /**
   * Algorithm-based validation of Turkish identity number
   * @param {string} identityId - 11-digit Turkish identity number
   * @returns {boolean} - Whether the identity number is valid
   */
  idValidation(identityId) {
    // Must be 11 digits
    if (identityId.length !== 11) {
      return false;
    }

    // Must contain only digits
    if (!/^\d+$/.test(identityId)) {
      return false;
    }

    // First digit cannot be 0
    if (identityId.charAt(0) === "0") {
      return false;
    }

    // Split into individual digits
    const digits = identityId.split("").map(Number);

    // Calculate sums of odd and even positioned digits (1-indexed)
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

    // 10th digit calculation
    const calculate10th = (oddSum * 7 - evenSum) % 10;

    // 11th digit calculation
    const calculate11th = (oddSum + evenSum + digits[9]) % 10;

    // Check if calculated digits match the actual 10th and 11th digits
    if (calculate10th !== digits[9] || calculate11th !== digits[10]) {
      return false;
    }

    return true;
  }

  /**
   * Simulates online identity validation (mock implementation)
   * In a real implementation, this would make a SOAP request to the Turkish government service
   *
   * @param {Object} data - Identity data object
   * @param {string} data.identity - 11-digit identity number
   * @param {string} data.name - First name
   * @param {string} data.surname - Last name
   * @param {number} data.year - Birth year
   * @returns {Promise<boolean>} - Whether the identity information is valid
   */
  async identityValidation(data) {
    return this.IdentityVerification(data);
  }

  /**
   * Alternative name for identityValidation (for compatibility)
   */
  async IdentityVerification(data) {
    // For demo purposes, we'll consider it valid if the algorithm validation passes
    // and the provided data looks reasonable

    // First check if identity number passes algorithm validation
    if (!this.idValidation(data.identity)) {
      return false;
    }

    // Mock validation - in a real implementation, this would make a SOAP request
    // to the Turkish government service

    // For demo purposes, we'll simulate some validation logic
    // and return a result after a short delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock validation rules:
        // 1. Name and surname must not be empty
        // 2. Year must be between 1900 and current year
        const isNameValid = data.name && data.name.trim().length > 0;
        const isSurnameValid = data.surname && data.surname.trim().length > 0;
        const isYearValid =
          data.year >= 1900 && data.year <= new Date().getFullYear();

        resolve(isNameValid && isSurnameValid && isYearValid);
      }, 500); // Simulate network delay
    });
  }

  /**
   * Simulates document validation (mock implementation)
   * In a real implementation, this would make a SOAP request to the Turkish government service
   *
   * @param {Object} data - Document data
   * @param {number} data.type - Document type (1 for old, 2 for new)
   * @param {string} data.identity - 11-digit identity number
   * @param {string} data.name - First name
   * @param {string} data.surname - Last name
   * @param {string} data.day - Birth day (DD)
   * @param {string} data.month - Birth month (MM)
   * @param {string} data.year - Birth year (YYYY)
   * @param {string} data.document_serial - Document serial
   * @param {string} data.document_no - Document number (only for old type)
   * @returns {Promise<boolean>} - Whether the document information is valid
   */
  async identityDocumentValidation(data) {
    return this.IdentityDocumentVerification(data);
  }

  /**
   * Alternative name for identityDocumentValidation (for compatibility)
   */
  async IdentityDocumentVerification(data) {
    // First check if identity number passes algorithm validation
    if (!this.idValidation(data.identity)) {
      return false;
    }

    // Mock validation - in a real implementation, this would make a SOAP request
    // to the Turkish government service

    // For demo purposes, we'll simulate some validation logic
    // and return a result after a short delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock validation rules:
        const isNameValid = data.name && data.name.trim().length > 0;
        const isSurnameValid = data.surname && data.surname.trim().length > 0;

        // Date validation
        const isDayValid = data.day >= 1 && data.day <= 31;
        const isMonthValid = data.month >= 1 && data.month <= 12;
        const isYearValid =
          data.year >= 1900 && data.year <= new Date().getFullYear();

        // Document-specific validation
        let isDocumentValid = false;

        if (data.type === 1) {
          // Old document type validation
          isDocumentValid =
            data.document_serial &&
            data.document_no &&
            data.document_serial.trim().length > 0 &&
            data.document_no.trim().length > 0;
        } else if (data.type === 2) {
          // New document type validation
          isDocumentValid =
            data.document_serial && data.document_serial.trim().length > 0;
        }

        resolve(
          isNameValid &&
            isSurnameValid &&
            isDayValid &&
            isMonthValid &&
            isYearValid &&
            isDocumentValid
        );
      }, 500); // Simulate network delay
    });
  }

  /**
   * Turkish uppercase conversion
   * @param {string} text - Input text
   * @returns {string} - Uppercase text with Turkish character support
   */
  trStrtoupper(text) {
    const searchChars = ["ç", "i", "ı", "ğ", "ö", "ş", "ü"];
    const replaceChars = ["Ç", "İ", "I", "Ğ", "Ö", "Ş", "Ü"];

    let result = text;
    for (let i = 0; i < searchChars.length; i++) {
      result = result.replace(new RegExp(searchChars[i], "g"), replaceChars[i]);
    }

    return result.toUpperCase();
  }
}

export default TurkishIdentityValidation;

import AppError from "./apperror.js";
class ErrorManager {
  static handleError(error) {
    if (error instanceof AppError) {
      addInvalidClass(error.HTMLElement);
      error.HTMLElement.parentElement.parentElement.nextElementSibling.classList.remove(
        "d-none"
      );
      console.error(error.message);
      console.error(error.HTMLElement);
      // Display error message to user
    } else {
      console.error(error);
      // Handle other types of errors
    }
  }
}
function addInvalidClass(element) {
  if (element.classList.contains("is-valid")) {
    element.classList.replace("is-valid", "is-invalid");
    return;
  }
  element.classList.add("is-invalid");
}
export default ErrorManager;

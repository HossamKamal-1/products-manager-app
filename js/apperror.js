class AppError extends Error {
  constructor(message, element) {
    super(message);
    this.name = "AppError";
    this.HTMLElement = element;
  }
}
export default AppError;

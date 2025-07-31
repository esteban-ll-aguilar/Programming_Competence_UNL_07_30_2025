class BaseAppException(Exception):
    """Base exception for all application-specific exceptions."""
    def __init__(self, message: str = "An error occurred in the application"):
        self.message = message
        super().__init__(self.message)


class DatabaseError(BaseAppException):
    """Exception raised for errors related to database operations."""
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message)


class NotFoundError(BaseAppException):
    """Exception raised when a requested resource is not found."""
    def __init__(self, resource: str = "Resource"):
        message = f"{resource} not found"
        super().__init__(message)


class ValidationError(BaseAppException):
    """Exception raised for validation errors."""
    def __init__(self, message: str = "Validation failed"):
        super().__init__(message)


class AuthenticationError(BaseAppException):
    """Exception raised for authentication errors."""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message)


class AuthorizationError(BaseAppException):
    """Exception raised for authorization errors."""
    def __init__(self, message: str = "Not authorized to perform this action"):
        super().__init__(message)


class ConfigurationError(BaseAppException):
    """Exception raised for configuration errors."""
    def __init__(self, message: str = "Configuration error"):
        super().__init__(message)

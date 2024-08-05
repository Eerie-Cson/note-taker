export class RequiredFieldMissingError extends Error {
  constructor() {
    super('Title should not be empty');
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden');
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not found');
  }
}

export class BadRequestError extends Error {
  constructor() {
    super('Bad request');
  }
}

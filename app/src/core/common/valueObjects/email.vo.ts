import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    const normalized = email.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new ResourceInvalidException('Invalid email address');
    }
    this.value = normalized;
    Object.freeze(this);
  }

  public static create(email: string): CoreResponse<Email> {
    try {
      const emailInstance = new Email(email);

      return { value: emailInstance, error: undefined };
    } catch (error) {
      return {
        error: error as ResourceInvalidException,
        value: undefined,
      };
    }
  }

  private static isValid(email: string): boolean {
    // Local part: must start and end with alphanumeric, can contain dots/underscores/hyphens/plus
    // No consecutive dots allowed
    // Domain part: alphanumeric and hyphens, separated by dots, ending with TLD (2+ chars)
    const regex =
      /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}

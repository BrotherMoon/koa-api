module.exports = {
  COMMON_ERROR: {
    ILLEGAL_PARAMETER: ['illegal parameter', 1002],
    INVALID_MONGOID:['invalid mongoId', 1002]
  },
  USER_ERROR: {
    ILLEGAL_NAME: [
      'the length of name must between 3 and 15', 1002
    ],
    ILLEGAL_PASSWORD: [
      'the password must be a string and have at least 6 characters', 1002
    ],
    ILLEGAL_ACTIVE: [
      'active need to be one of 0 and 1', 1002
    ],
    ILLEGAL_PROFILE: [
      'the length of profile no more than 30', 1002
    ],
    ILLEGAL_EMAIL: [
      'illegal email', 1002
    ],
    USER_EXISTS: [
      'username already exists', 1005
    ],
    EMAIL_USED: [
      'email has been used', 1009
    ],
    WRONG_PASSWORD: ['wrong password', 1004]
  },
  BLOG_ERROR: {
    ILLEGAL_TITLE: [
      'the length of title no more than 30 and it must be string', 1002
    ],
    ILLEGAL_CONTENT: [
      'content must be a string and can`t not be empty', 1002
    ],
    ILLEGAL_PUBLIC: [
      'public need to be one of 0 and 1', 1002
    ],
    ILLEGAL_TAG: ['tag must be a string and the length of tag must between 1 and 15', 1002]
  }
}

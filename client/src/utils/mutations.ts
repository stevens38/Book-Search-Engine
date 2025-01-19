import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const add_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const save_Book = gql`
  mutation SaveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
     _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const remove_Book = gql`
  mutation removeBook($bookID: String!) {
    removebook(bookId: $bookId) {
      _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
       }
      }
    }
`;

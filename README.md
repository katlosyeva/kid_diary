# Kid-Diary

Kid-Diary is an API written with GraphQL, designed to serve as a diary for new moms to document their children's milestones, such as first words and skills. These moments are incredibly special for parents, and Kid-Diary aims to provide a convenient platform for recording and cherishing them.

## Getting Started

To get started with Kid-Diary, follow these steps:

### Clone the repository:

```bash
git clone https://github.com/your-username/kid-diary.git
```

### Install dependencies:

```bash
npm install
```

### Create a config.env file at the root of the project and configure the following environment variables:

```bash
SECRET=your_secret_jwt_token
JWT_EXPIRES_IN=token_expiration_type
CONNECTION=mongodb_connection_string
```

### Start the server:

```bash
npm start
```

## Testing

A Postman request collection is provided in the repository for testing the API. Import the collection into your Postman environment and use it to interact with Kid-Diary.

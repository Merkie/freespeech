# [FreeSpeech AAC](http://freespeechaac.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/merkie/freespeech/blob/main/LICENSE)

FreeSpeech AAC is a free and open-source assistive communication app written in TypeScript. [Talk with us on Discord!](https://discord.gg/rEzaDqdfet)

![devices](https://user-images.githubusercontent.com/18383101/199581923-7ca35818-8280-49e1-a2e1-66a5602cfff0.png)

FreeSpeech AAC is committed to providing the best AAC experience to users, this is accomplished by packaging FreeSpeech with technologies sourced from AWS, Micorosoft Cognitive Services, and Google Cloud that give users cutting-edge AI generated voices. FreeSpeech is also putting artificial intelligence to use by relying on the OpenAI GPT-3 model to handle complex textual analysis tasks along with phrase and word conjugation. FreeSpeech's client is built on top of Svelte, a blazingly fast front-end UI framework.

I created FreeSpeech initially for my sister who is nonverbal, but since then the project has been actively gaining users as the application also serves as a viable alternative to many other expensive pieces of AAC software. Keep up with the latest FreeSpeech news on the blog portion of the website!

### Local development setup

- Clone and enter into the project directory
  `git clone https://github.com/merkie/freespeech freespeech && cd freespeech`
- Run the Docker Compose file with the local PostgreSQL and LocalStack setup
  `docker compose up -d`
- Install dependencies
  `npm install`
- Create the `.env` file with required values based on the `.env.example` file -> see [Environment Configuration](#environment-configuration) for more information.

- Run Prisma Migrations for the database
  `npx prisma migrate dev`
- Run the dev command
  `npm run dev`

With the default `.env.example` configuration the Google Login, Bing Image Search and Eleven Labs do not work. If you need them for you development create Google, Azure or Eleven Labs accounts and provide the required keys defined in the [Environment Configuration](#environment-configuration) section.

### Environment Configuration

This project uses environment variables to configure various aspects of the application. Below is a description of each environment variable required:

- **DATABASE_URL**: Connection string for the PostgreSQL database. Format: `postgresql://USERNAME:PASSWORD@HOST:PORT/DB_NAME?schema=SCHEMA_NAME`.

- **JWT_SECRET**: Secret key used to sign and verify JSON Web Tokens (JWTs). Ensure this key is kept secret and not exposed publicly.

- **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**: Credentials for Google OAuth 2.0 authentication. These are provided by the Google API Console.

- **GOOGLE_OAUTH_REDIRECT**: Redirect URL for Google OAuth 2.0 flow.

- **R2_ACCOUNT_ID**, **R2_ACCESS_KEY**, **R2_SECRET_KEY**, **R2_BUCKET**: Credentials and bucket name for R2 cloud storage services.

- **R2_PUBLIC_URL**: Public URL for the R2 storage.

- **BING_IMAGE_SEARCH_KEY**: API key for Bing Image Search services.

- **SITE_SECRET**: Secret key used for additional site security measures.

- **ELEVEN_LABS_KEY**: API key for accessing Eleven Labs services.

- **PUBLIC_CDN_URL**: Public URL for accessing the content delivery network.

### Setup Instructions

1. Copy the provided `.env.example` file to a new file named `.env`.
2. Fill in the values for each environment variable as per your setup and credentials.
3. The default values in `env.example` will run application with the R2, Database, JWT and Site Secret configured and working using the resources from Docker Compose.

> **Note**: Never commit your `.env` file or any sensitive keys to the repository. Ensure `.env` is listed in your `.gitignore`.

## Sponsors

<a href="https://opensource.optum.com/"><img src="https://i.postimg.cc/NGRqXYJs/optum.png" width=200px></a>

## Special Thanks

<a href="https://icons8.com/"><img src="https://logos-download.com/wp-content/uploads/2020/06/Icons8_Logo_full.png" width=100px></a> <a href="https://www.bbc.com/news/av/disability-57515272"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/2560px-BBC_Logo_2021.svg.png" width=100px></a> <a href="https://www.cnn.com/2021/12/19/us/texas-teen-freespeech-app/index.html"><img src="https://1000logos.net/wp-content/uploads/2021/04/CNN-logo.png" width=100px></a>

Thank you to CNN and the BBC for covering the FreeSpeech project! Also huge thank you to Icons8 for providing all the icon assets for the project. Click on the logos to see more.

## Project Authors

- **Archer Calder** - _Founder/Lead Developer_ - [GitHub](https://github.com/Merkie) [Donate](https://ko-fi.com/merkie) *archercalder@gmail.com*
- **Bailey Townsend** - _Core Team Member_ - [GitHub](https://github.com/fatfingers23) [Linkedin](https://www.linkedin.com/in/bailey-townsend-25b195105)

None of this would be possible without you all. Thank you!
<a href="https://github.com/Merkie/freespeech/graphs/contributors">
<img src="https://contributors-img.firebaseapp.com/image?repo=Merkie/freespeech" />
</a>

Made with [contributors-img](https://contributors-img.firebaseapp.com).

### License

Free Speech AAC is [MIT licensed](./LICENSE).
# freespeech-api

# Talentmaker Site

[![Live Site](https://img.shields.io/badge/Site-talentmaker.ca-blue?style=for-the-badge&logo=AWS%20Amplify)](https://talentmaker.ca)

[![GitHub](https://img.shields.io/github/license/Luke-zhang-04/talentmaker-site?style=flat-square)](https://github.com/Luke-zhang-04/talentmaker-site/blob/master/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Luke-zhang-04/talentmaker-site/build?style=flat-square&logo=Github)](https://github.com/Luke-zhang-04/talentmaker-site/actions)
[![Code Size](https://img.shields.io/github/languages/code-size/Luke-zhang-04/talentmaker-site?style=flat-square)](.)

Web app for [talentmaker](https://talentmaker.ca) white interacts with a proprietary API (which will eventually be open sourced)

## Browser Support

The current browserslist config covers about 90% of users

## Resources

-   [Generate PWA Icons](https://realfavicongenerator.net/)

## Directory Structure

The directory structure in `src/` is based off this [Free Code Camp Article](https://www.freecodecamp.org/news/a-better-way-to-structure-react-projects/)

-   `adapers`
    -   All connections to API endpoints are made here
    -   The `createAdapters` API is a nifty way to reduce imports and create endpoint interactions with minimal boilerplate
-   `components`
    -   The first "layer" defines all all **reusable** components
    -   Page-specific components go into `components/pages`
-   `contexts`
    -   Defines all React contexts
-   `images`
    -   Includes commonly reused images
-   `pages`
    -   Defines individual pages which leverage components from `components` to display content, while doing the necessary preprocessing to display these components
-   `schemas`
    -   Includes yup schemas and their respective output types
-   `styles`
    -   Global scss styles such as SASS variables
-   `utils`
    -   Utility functions

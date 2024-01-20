# RSSR

RSS posts search and index engine.

## How it works

The crawler simply goes and fetches all the posts from a list of curated feeds. Upon fetching, posts are stored in the database and available for search. While viewing, users update the views count on posts as well as tags, that later can be reused to improve search results.

## Setup

In order to run the app do `npm install` in both folders (client & server). To run locally do `npm run dev` in each folder. Also, you will need the mongodb container to be up locally. (`docker start --name rssr-mongo -p27017:27017 -d mongo`).

Furthermore, before running, you should update .env files in client and server. I have commited .env s I use locally as an example.

## Backlog

+ Deploy to rssr.lxch.io
+ Make RSS feed by search query
+ Check tags uniqueness on BE
+ Add authentication and rating
+ Add curated collections
+ Debounce tag search in tags-input

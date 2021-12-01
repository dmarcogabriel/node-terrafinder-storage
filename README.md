# Terrafinder Storage API

## Description
This is a simple app that store, show and delete files (it's a work around of using amazon s3)

## Scripts
`$ yarn dev` to start application on development mode

`$ yarn start` to start application on production mode

## Endpoints
`GET "/:filename" -> Search an image by it's name`

`POST "/" body { file: <file> } headers { Content-Type: multipart/form-data } -> Store a given file`

`DELETE "/:filename" -> Deletes a file by it's name`
// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest'

// Import and rename a variable exported by ventanas.js.
import { name as packageName } from 'meteor/ventanas'

// Write your tests here!
// Here is an example.
Tinytest.add('ventanas - example', function (test) {
  test.equal(packageName, 'ventanas')
})

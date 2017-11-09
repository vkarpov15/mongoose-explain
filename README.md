# mongoose-explain
Log mongoose `.explain()` output for your mongoose `.find()`, `.findOne()`, and `.aggregate()` calls to the console

## Example

```javascript
var mongoose = require('mongoose');
var explain = require('mongoose-explain');

var schema = new Schema({
  title: String,
  author: String,
  options: String
});

schema.plugin(explain);

var Author = mongoose.model('Author', schema, 'author');

// Logs `[{ queryPlanner: [Object], executionStats: [Object], serverInfo[Object] }]`
// on MongoDB 3.0.
// See https://docs.mongodb.com/manual/reference/explain-results/
Author.find({ title: 'Professional AngularJS' }, function(err, res) {});
```

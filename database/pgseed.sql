DROP TABLE IF EXISTS favorites;
CREATE TABLE favorites (username VARCHAR(100), venue_json VARCHAR(255));

INSERT INTO favorites VALUES('tester', '{"id":"4d84f99602eb548100393af5","address":"39 E 20th St Fl 4","name":"New York Chinese Shaolin Center","pluralName":"Martial Arts Schools","menuUrl":null,"imageUrl":"https://cdn.stocksnap.io/img-thumbs/960w/sliced-homemade_5BADCUBZS9.jpg"}');
INSERT INTO favorites VALUES('tester', '{"id":"4c5dfa357f661b8d3f0c4d1c","address":"180 Crandon Blvd","name":"Vito Italian Restaurant","pluralName":"Italian Restaurants","menuUrl":null,"imageUrl":"https://cdn.stocksnap.io/img-thumbs/960w/sliced-homemade_5BADCUBZS9.jpg"}');
INSERT INTO favorites VALUES('tester', '{"id":"4b00f8a6f964a5208e4122e3","address":"208 W 23rd St","name":"Gotham Comedy Club","pluralName":"Comedy Clubs","menuUrl":null,"imageUrl":"https://fastly.4sqi.net/img/general/612x612/2464986_UiZxNiJ_0xjeufjAZ0I4gqifFRh6QnkZOjd47A7kgTQ.jpg"}');

COMMIT;

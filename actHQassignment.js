// Challenge

// Given a specific dataset representing company information and a set of changes that have accumulated over a period of time, write a program that takes a timestamp and query as input, and gives a YES/NO output based on whether the query succeeds or fails based on the underlying data.

// Outlined below is a representative sample containing data for a Company and some query samples.

// Company Data

// Company = {
// 	name: "ActHQ",
// 	legal_name: "ActHQ Inc.",
// 	domain: "acthq.com",
// 	url: "https://acthq.com",
// 	type: "Private",
// 	founded_year: 2022,
// 	headcount: 2,
// 	location: [{
//   		city: "San Francisco",
//   		state: "California",
//   	country: "United State"
// 	}],
// 	timestamp: "2022-01-30"
// }

// Delta = [

// // Company grew headcount & added social media profiles
//   {
// 	headcount: 4,
// 	social_profiles: {
//   		twitter: "https://twitter.com/ActHQ",
//   		linkedin: "https://www.linkedin.com/company/act-hq"
// 	},
// 	timestamp: "2022-06-12"
//   },

//   // Company raised the seed round
//   {
// 	funding: {
//   		amount: "1500000",
// 		currency: “USD”,
//   	round: "Seed"
// 	},
// 	timestamp: "2023-01-25"
//   },

//   // Company raised Series A and grew headcount
//   {
// headcount: 10,
// 	funding: {
//   	amount: "5000000",
// 		currency: “USD”,
//   		round: "Series A"
// 	},
// 	timestamp: "2024-10-08"
//   }
// ]

// Query Samples

// // Did the company raise a seed round by the end of March 2022?
// Query:
// {
// 	funding: {
// 		round: “Seed”
// 	},
// 	timestamp: “2022-03-31”
// }

// Answer: NO

// // Did the company raise a seed round by the end of Jan 2023 and is headquartered in San Francisco?
// Query:
// {
// 	funding: {
// 		round: “Seed”
// 	},
// 	location: {
// 		city: “San Francisco”
// 	},
// 	timestamp: “2023-01-31”
// }

// Answer: YES

// // Was the company’s headcount less than 10 by the end of the year 2022?
// Query:
// {
// 	headcount: {
// 		min: 0,
// 		max: 10
// 	},
// 	timestamp: “2022-12-31”
// }

// Answer: YES

// // Did the company go public by the end of the year 2024?
// Query:
// {
// 	type: “Public”,
// 	timestamp: “2024-12-31”
// }

// Answer: NO

// Notes

// Please use a programming language of your choice to represent the data and logic
// It’s advisable to come up with alternative implementations with varying degrees of complexity
// You should be able to clearly explain the memory and time complexities of different implementations
// (Assume that the company & query objects both can have a maximum of A attributes, each with at most N-levels of nesting. The input stream of Delta changes consist of D separate streams, each having maximum of A attributes, with at most N-levels of nesting)
// Although real working code would be preferable, we would be more interested in the approach you took as compared to the accuracy of the output

// Constraints

// What would be the efficient way to store and query this kind of data?
// How would your solution change when the delta changes are not a static set, instead these are provided as data-streams happening as time goes by?
// How would you handle complex queries involving multiple attributes with nested AND/OR/NOT conditions in an efficient way?
// Assuming there are millions of such companies and they have thousands of streaming changes on average over the course of time, how would the data storage, comparison and query look like?

comapnyData = {
  legal_name: "ActHQ Inc.",
  domain: "acthq.com",
  url: "https://acthq.com",
  type: "Private",
  founded_year: 2022,
  headcount: 2,
  location: [
    {
      city: "San Francisco",
      state: "California",
      country: "United State",
    },
  ],
  timestamp: "2022-01-30",
};

Delta = [
  // Company grew headcount & added social media profiles
  {
    headcount: 4,
    social_profiles: {
      twitter: "https://twitter.com/ActHQ",
      linkedin: "https://www.linkedin.com/company/act-hq",
    },
    timestamp: "2022-06-12",
  },

  // Company raised the seed round
  {
    funding: {
      amount: "1500000",
      currency: "USD",
      round: "Seed",
    },
    timestamp: "2023-01-25",
  },

  // Company raised Series A and grew headcount
  {
    headcount: 10,
    funding: {
      amount: "5000000",
      currency: "USD",
      round: "Series A",
    },
    timestamp: "2024-10-08",
  },
];

function query(queryObj) {
  const keys = Object.keys(queryObj);

  // Check each item in delta with timestamp less than query timestamp
  for (let i = 0; i < Delta.length; i++) {
    if (Delta[i].timestamp < queryObj.timestamp) {
      for (let j = 0; j < keys.length; j++) {
        if (keys[j] === "headcount" && Delta[i].headcount) {
          if (
            Delta[i].headcount > queryObj.headcount.min &&
            Delta[i].headcount < queryObj.headcount.max
          ) {
            return true;
          }
        } else if (keys[j] === "funding" && Delta[i].funding) {
          if (Delta[i].funding.round === queryObj.funding.round) {
            return true;
          }
        } else if (keys[j] === "location" && Delta[i].location) {
          if (Delta[i].location.city === queryObj.location.city) {
            return true;
          }
        } else if (keys[j] === "type" && Delta[i].type) {
          if (Delta[i].type === queryObj.type) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

console.log(query({ funding: { round: "Seed" }, timestamp: "2022-03-31" })); // false
console.log(
  query({
    funding: { round: "Seed" },
    location: { city: "San Francisco" },
    timestamp: "2023-01-31",
  })
); // true

console.log(query({ headcount: { min: 0, max: 10 }, timestamp: "2022-12-31" })); // true
console.log(query({ type: "Public", timestamp: "2024-12-31" })); // false

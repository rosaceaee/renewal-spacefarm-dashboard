// before to be updated.
/*
const a = function show() {
	const regex1 = RegExp('practice', 'g');
  let array1;
  while ((array1 = regex1.exec(str1)) !== null) {
  	console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
  
    return JSON.stringify(array1[0], regex1.lastIndex);

	}
}

let str1 = 'This is test statement for practice regExp constructor' + {a} ;

const statement = document.createElement("h2");
statement.textContent = str1;

document.body.appendChild(statement); */

// after updated
const show = function () {
  const regex1 = /practice/g;
  let array1;
  const matches = [];

  while ((array1 = regex1.exec(str1)) !== null) {
    console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
    matches.push({ match: array1[0], index: regex1.lastIndex });
  }

  return JSON.stringify(matches);
};

let str1 = "This is test statement for practice regExp constructor";

const statement = document.createElement("h2");
statement.textContent = str1 + " " + show(); // Call the show function and concatenate the result

document.body.appendChild(statement);

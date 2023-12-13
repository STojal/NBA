






// autocomplete
const searchInput = document.querySelector('.input')
searchInput.addEventListener("input", (e) => {
    let value = e.target.value

    if (value && value.trim().length > 5){
         value = value.trim().toLowerCase()

        //returning only the results of setList if the value of the search is included in the person's name
        setList(people.filter(person => {
            return person.name.includes(value)
    }));
};});


// creating and declaring a function called "setList"
// setList takes in a param of "results"
function setList(results){

    for (const person of results){
        // creating a li element for each result item
        const resultItem = document.createElement('li')

        // adding a class to each item of the results
        resultItem.classList.add('result-item')

        // grabbing the name of the current point of the loop and adding the name as the list item's text
        const text = document.createTextNode(person.name)

        // appending the text to the result item
        resultItem.appendChild(text)

        // appending the result item to the list
        list.appendChild(resultItem)
    }
}
function setList(results){
    clearList()
    for (const person of results){
        const resultItem = document.createElement('li')
        resultItem.classList.add('result-item')
        const text = document.createTextNode(person.name)
        resultItem.appendChild(text)
        list.appendChild(resultItem)
    }

    if (results.length === 0 ){
        noResults()
    }
}



function noResults(){
    // create an element for the error; a list item ("li")
    const error = document.createElement('li')
    // adding a class name of "error-message" to our error element
    error.classList.add('error-message')

    // creating text for our element
    const text = document.createTextNode('No results found. Sorry!')
    // appending the text to our element
    error.appendChild(text)
    // appending the error to our list element
    list.appendChild(error)
}
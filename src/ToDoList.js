import { useRef, useState } from "react"

function RhymesList(){
    const [output, setOutput] = useState([]);
    const [title, setTitle] = useState('');

    const inputRef = useRef('');
    const elements = [];
    

    let [saved, setSaved] = useState([]);
    const savedElements = [];

    function savingList(word){
        saved.push(word);
        for (const i of saved){
            const key = saved.indexOf(i)
            const s = <SavedItems key={key} savedWord = {i} savedList={saved}></SavedItems>;
            savedElements.push(s);
        }
        setSaved(savedElements);
        // I am able to console log a saved list properly, but the saved words are not updating in the browser.
        console.log(saved);
    }

    function SavedItems(props){
        return <>{saved}, </>
    }

    function Items(props){
        return <><li>{ props.description } <button onClick={()=> savingList(props.description)}>save</button></li></> 
    }
    function groupBy(objects, property) {
        // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
        // value for property (obj[property])
        if(typeof property !== 'function') {
            const propName = property;
            property = (obj) => obj[propName];
        }
    
        const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
        for(const object of objects) {
            const groupName = property(object);
            //Make sure that the group exists
            if(!groupedObjects.has(groupName)) {
                groupedObjects.set(groupName, []);
            }
            groupedObjects.get(groupName).push(object);
        }
    
        // Create an object with the results. Sort the keys so that they are in a sensible "order"
        const result = {};
        for(const key of Array.from(groupedObjects.keys()).sort()) {
            result[key] = groupedObjects.get(key);
        }
        return result;
    }
    
    function getRhymes(rel_rhy, callback) {
        fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`)
            .then((response) => response.json())
            .then((data) => {
                callback(data);
            }, (err) => {
                console.error(err);
            });
    }

    function getSynonyms(ml, callback) {
        fetch(`https://api.datamuse.com/words?${(new URLSearchParams({ml})).toString()}`)
            .then((response) => response.json())
            .then((data) => {
                callback(data);
            }, (err) => {
                console.error(err);
            });
    }


    function addRhymes(){
        let output = [];
        const wordInput = inputRef.current.value 
        //console.log(wordInput)
        let title = "Words that rhyme with " + wordInput +":"

        getRhymes(wordInput,(result)=>{
            const grouped = groupBy(result, 'numSyllables');
            const vals = (Object.values(grouped));
            const reorderedResult = vals.flat();

            for (const i of reorderedResult){
                const line = i.word
                output.push(line);
            }

            for (const i of output){
                const key = output.indexOf(i)
                const elem = <Items key={key} description = {i}></Items>;
                elements.push(elem);
                
                
            }
            setOutput(elements);
            setTitle(title);

        }) 
    };

    function addSynonyms(){
        let output = []; 
        const wordInput = inputRef.current.value
        let title = "Words with a similar meaning to " + wordInput +":"

        getSynonyms(wordInput,(result)=>{
            const grouped = groupBy(result, 'numSyllables');
            const vals = (Object.values(grouped));
            const reorderedResult = vals.flat();

            for (const i of reorderedResult){
                const line = i.word
                output.push(line);
            }
            for (const i of output){
                const key = output.indexOf(i)
                const elem = <Items key={key} description = {i}></Items>;
                elements.push(elem);
            }
            setOutput(elements);
            setTitle(title);
            //console.log(output);
            //console.log(title);
        }) 
    };

    function useKey(event){
        if (event.key === 'Enter'){
            addRhymes();
        };
    };


    return <div>
    <p>Saved Words: {saved}</p>
    <input ref= {inputRef} type="text" onKeyPress={useKey}></input>
    <button onClick={addRhymes}>Show Rhyming Words</button>
    <button onClick={addSynonyms}>Show Synonyms</button>
    <h1>{title}</h1>
    <ul>
        {output}
    </ul>
    </div>
}
export default RhymesList;
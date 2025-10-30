import jobCategories from "./jobCategories.js";
const jobcat = document.getElementById("categoryDropdown");


for(let parent in jobCategories){
    const parentOptgroup = document.createElement("optgroup");
    parentOptgroup.label = parent;
    parentOptgroup.classList.add("optgroup-category")
    for(let jobCategory of jobCategories[parent]){
          const childoption = document.createElement("option");
          childoption.value = jobCategory;
          childoption.textContent = jobCategory;
          childoption.classList.add("option-category")
          parentOptgroup.appendChild(childoption);
    }
    jobcat.appendChild(parentOptgroup);
}


/*
<select> 
  <optgroup label="PARENT CATEGORY">
    <option value="CHILD CATEGORY">CHILD CATEGORY</option>
  </optgroup>
</select>
*/
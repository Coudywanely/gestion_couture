//PARTIE CHARGEMENT D'IMAGE
const photo = document.querySelector('#image');
const form = document.querySelector(".container form");
const fields = form.querySelectorAll("input[type='text'], select");
const validateButton = document.getElementById("validateButton");

photo.addEventListener('change', changeImage);

function changeImage() {
    let file = new FileReader();
    file.readAsDataURL(photo.files[0]);
    file.onloadend = function (event) {
        const path = event.target.result;
        document.querySelector('#photo').setAttribute('src', path);
    }
}
//FIn PARTIE CHARGEMENT D'IMAGE

validateButton.addEventListener("click", function () {
    let hasEmptyFields = false;

    fields.forEach((field) => {
        const errorMessage = field.parentElement.querySelector(".error-message");
        if (field.value.trim() === "" || (field.tagName === "SELECT" && field.value === "")) {
            hasEmptyFields = true;
            errorMessage.textContent = "Champ obligatoire";
            errorMessage.style = "color: red"
        } else {
            errorMessage.textContent = "";
        }
    });

    if (hasEmptyFields) {
        event.preventDefault();
    }
});
//PARTIE CATEGORIE 
// Partie Catégorie
const selectElement = document.getElementById("categorie");
const selectedCategoriesElement = document.getElementById("selectedCategories");
let currentSelectedRadio = null;
const selectedCategoryValueElement = document.getElementById("selectedCategoryValue");

fetch("http://localhost:8000/api/categorie")
    .then(response => response.json())
    .then(categories => {
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.libelle;
            selectElement.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des catégories :", error);
    });

selectElement.addEventListener("change", function () {
    const selectedValue = selectElement.value;

    if (currentSelectedRadio) {
        selectedCategoriesElement.removeChild(currentSelectedRadio);
        currentSelectedRadio = null;
    }

    if (selectedValue) {
        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "selectedCategory";
        radio.checked = true;

        const label = document.createElement('label');
        label.appendChild(document.createTextNode(selectedValue));
        label.appendChild(radio);

        radio.addEventListener("change", function () {
            if (!radio.checked) {
                currentSelectedRadio = null;
            } else {
                currentSelectedRadio = label;
            }
        });

        selectedCategoriesElement.appendChild(label);
        currentSelectedRadio = label;

        selectedCategoryValueElement.textContent = selectedValue;

    }
});
const newCategoryInput = document.getElementById("newCategoryInput");
const saveCategoryButton = document.getElementById("saveCategoryButton");

saveCategoryButton.addEventListener("click", function () {
    const newCategory = newCategoryInput.value;
    if (newCategory) {
        fetch("http://localhost:8000/api/categorie/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ libelle: newCategory })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    const option = document.createElement("option");
                    option.value = newCategory;
                    option.textContent = newCategory;
                    selectElement.appendChild(option);
                    newCategoryInput.value = "";
                } else {
                    console.error("Erreur lors de l'ajout de la catégorie :", data.message);
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout de la catégorie :", error);
            });
    }
});
// Ajout d'unités
const selectElementUnite = document.getElementById("unite");
const selectedUnitesElement = document.getElementById("selectedUnites");
let currentSelectedRadioUnite = null;

fetch("http://localhost:8000/api/unite")
    .then(response => response.json())
    .then(unites => {
        unites.forEach(unite => {
            const option = document.createElement("option");
            option.value = unite.libelle;
            option.textContent = unite.libelle;
            selectElementUnite.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des unités :", error);
    });

selectElementUnite.addEventListener("change", function () {
    const selectedValueUnite = selectElementUnite.value;

    if (currentSelectedRadioUnite) {
        selectedUnitesElement.removeChild(currentSelectedRadioUnite);
        currentSelectedRadioUnite = null;
    }

    if (selectedValueUnite) {
        const radioUnite = document.createElement('input');
        radioUnite.type = "radio";
        radioUnite.name = "selectedUnite";
        radioUnite.checked = true;

        const labelUnite = document.createElement('label');
        labelUnite.appendChild(document.createTextNode(selectedValueUnite));
        labelUnite.appendChild(radioUnite);

        radioUnite.addEventListener("change", function () {
            if (!radioUnite.checked) {
                currentSelectedRadioUnite = null;
            } else {
                currentSelectedRadioUnite = labelUnite;
            }
        });

        selectedUnitesElement.appendChild(labelUnite);
        currentSelectedRadioUnite = labelUnite;
    }
});

const newUniteInput = document.getElementById("newUniteInput");
const newConversionInput = document.getElementById("newConversionInput");
const saveUniteButton = document.getElementById("saveUniteButton");

saveUniteButton.addEventListener("click", function () {
    const newUnite = newUniteInput.value;
    const newConversion = newConversionInput.value;
    const selectedCategory = selectedCategoryValueElement.textContent;

    if (newUnite && newConversion && selectedCategory) {
        // console.log("newUnite :", newUnite);
        // console.log("newConversion :", newConversion);
        // console.log("selectedCategory :", selectedCategory);
        fetch("http://localhost:8000/api/unite/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                libelle: newUnite,
                conversion: newConversion,
                categorie: selectedCategory // Utilisation de l'ID de catégorie récupéré
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data);
                    const option = document.createElement("option");
                    option.value = newUnite;
                    option.textContent = newUnite;
                    selectElementUnite.appendChild(option);
                    newUniteInput.value = "";
                    newConversionInput.value = "";
                    selectedCategoryValueElement.textContent = "";
                    // categorie = selectedCategory;
                    console.log("Unité ajoutée avec succès !");
                } else {
                    console.error("Erreur lors de l'ajout de l'unité :", data.message);
                }
            })
            .catch(error => {
                console.error("Erreur lors de l'ajout de l'unité :", error);
            });
    }
});


//FIN PARTIE UNITE


const fournisseurInput = document.getElementById('fournisseurInput');
const errorDiv = document.querySelector('.error-message');
const autocompleteContainer = document.getElementById('autocompleteContainer');

fournisseurInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    
    try {
        const response = await fetch("http://localhost:8000/api/fournisseur");
        const suppliers = await response.json();

        // Clear previous results
        clearResults();

        // Filter suppliers based on the search term
        const filteredSuppliers = suppliers.filter(supplier =>
            supplier.nom.toLowerCase().includes(searchTerm.toLowerCase()) || supplier.prenom.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Populate the autocomplete list
        if (filteredSuppliers.length > 0) {
            filteredSuppliers.forEach(supplier => {
                const option = document.createElement('div');
                option.textContent = `${supplier.prenom} ${supplier.nom}`;
                option.classList.add('autocomplete-option');
                option.addEventListener('click', () => {
                    fournisseurInput.value = `${supplier.prenom} ${supplier.nom}`;
                    clearResults();
                });
                autocompleteContainer.appendChild(option);
            });
        } else {
            const noResults = document.createElement('div');
            noResults.textContent = 'Aucun résultat trouvé.';
            autocompleteContainer.appendChild(noResults);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        errorDiv.textContent = 'Une erreur s\'est produite lors de la récupération des données.';
    }
});

function clearResults() {
    while (autocompleteContainer.firstChild) {
        autocompleteContainer.removeChild(autocompleteContainer.firstChild);
    }
    errorDiv.textContent = '';
}



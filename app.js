const fileInput = document.getElementById('file-input');
const image = document.getElementById('image');
const description = document.getElementById('prediction');
const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
const inputError = document.getElementById('input-error');


async function loadModel() {
  model = await tf.loadLayersModel('tfjs_files/model.json');
  document.body.classList.remove('loading');

  fileInput.addEventListener('change', getImage);
  return model
}

let model = loadModel();


function classifyImage(dataImage) {

  const predict = model.predict(dataImage);

  const axis = 1;
  const predictions = Array.from(output.argMax(axis).dataSync());
  console.log(predictions);

  if (predictions[0] == 1) {
      description.innerText = 'Asterix!';
  } else if (predictions[0] == 2) {
      description.innerText= 'Obelix!';
  } else {
      description.innerText = 'Aucune idée' + predictions[0];
  }
}


function getImage() {
  if (!fileInput.files[0]) throw new Error('Image not found');
  const file = fileInput.files[0];

  if (!acceptedImageTypes.includes(file.type)) {
    inputError.classList.add('show');
    throw Error('The uploaded file is not an image');
  } else inputError.classList.remove('show');

  const reader = new FileReader();

  reader.onload = function (event) {
    const dataUrl = event.target.result;
  
    const imageElement = new Image();
    imageElement.src = dataUrl;
  
    imageElement.onload = function () {
      // Redimensionner l'image à la taille attendue par le modèle (par exemple, 150x150)
      const resizedImage = tf.image.resizeBilinear(tf.browser.fromPixels(imageElement), [150, 150]);
  
      // Afficher l'image redimensionnée dans l'élément HTML
      image.setAttribute('src', tf.browser.toPixels(resizedImage).src);
      image.setAttribute('height', '150');
      image.setAttribute('width', '150');
  
      // Classer l'image redimensionnée
      classifyImage(resizedImage.reshape([1, 150, 150, 3]));
    };
  
    document.body.classList.add('image-loaded');
  };

  reader.readAsDataURL(file);
}





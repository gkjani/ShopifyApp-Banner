import Axios from "axios"; 
import fs from "fs"; 
import path, { dirname } from "path"; 

const themeAPI = `admin/api/2021-04`;
export async function  updateTheme(shop,accessToken){
  const axios = Axios.create({
    baseURL : `https://${shop}/${themeAPI}`,
    headers : {
        'Content-Type' : 'application/json',
        'X-Shopify-Access-Token' : accessToken
    }
  });
 const mainThemeId = await getThemeId(axios);
 if(!mainThemeId){
   return; 
 }
 const newPage = await getAssetThemeLiquid(mainThemeId,axios); 
 if(newPage){
  await uploadAssetTheme(axios, mainThemeId, newPage,"layout/theme.liquid");
 }
 
   const newSnippet = fs.readFileSync(path.resolve(__dirname,"../../liquid/banner-app.liquid"),"utf-8");
   console.log("Nippet exist", newSnippet);
   await uploadAssetTheme(axios, mainThemeId, newSnippet,"snippets/banner-app.liquid");
}

function getFile(fileUrl){
return  fs.readFileSync(path.resolve(__dirname,fileUrl),"utf-8");
}

async function uploadAssetTheme(axios,id, page, pageName){
   const result =   await axios.put(`/themes/${id}/assets.json`,{
    "asset": {
      "key": pageName,
      "value": page
    }
   });

   console.log(`Upload page ${pageName}`); 
}


async function getAssetThemeLiquid(id, axios){
    const {data} = await axios.get(`/themes/${id}/assets.json?asset[key]=layout/theme.liquid`); 
   // console.log("Theme.liquid file ", data);
    if(!data.asset){
        return; 
    }
    const snippet = getFile("../../liquid/theme.liquid"); 
 
    if(data.asset.value.includes(snippet)){
      console.log("page has already snippet installed");
      return; 
    }
     var newPage = data.asset.value.replace(
      "{% section 'header' %}",
      `{% section 'header' %}\n ${snippet} \n`
      )
    //console.log('New page', newPage);
    return newPage; 
}

async function  getThemeId(axios){
  const { data } =  await axios.get('/themes.json');
  //console.log("Themes found", data);

  const mainTheme = data.themes.find(theme=> theme.role === 'main');
  if(!mainTheme){
     console.log("No main theme found");  
    return;
  }
  //console.log("The main theme is", mainTheme);
  //console.log("The main theme id is ", mainTheme.id);
  return mainTheme.id; 
}
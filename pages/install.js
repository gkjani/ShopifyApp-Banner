import { Layout, Page, SettingToggle, TextStyle } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";



function install() {
  const [axios] = useAxios();
  const nUrl = "https://efc1529bd24c.ngrok.io";
  const [isInstalled, setIsInstalled] = useState(null);
  const [scriptTagId, setScriptTagId] = useState();
 
  const titleDescription = isInstalled ? "Uninstall" : "Install";
  const bodyDescription = isInstalled ? "installed" : "uninstalled";

  

  async function fetchScriptTags() {
    const { data } = await axios.get(
      `${nUrl}/script_tag/all`
    );

    setIsInstalled(data.isInstalled);
    if(data.details.length > 0){
      setScriptTagId(data.details[0].id);
      console.log(data.details.length,"scripts installed");
    }
    
  }
useEffect(function(){
  setTimeout(async function(){
    await fetchScriptTags();
  },5000);
},[])

  async function handleAction() {
    if (!isInstalled) {
      axios.post(`${nUrl}/script_tag`);
    }else{
      axios.delete(`${nUrl}/script_tag/?id=${scriptTagId}`);
    }
    setIsInstalled((oldValue) => !oldValue);
  }

  return (
    <Page>
      <Layout.AnnotatedSection
        title={`${titleDescription} banner`}
        description="Toggle banner installation on your shop"
      >
        <SettingToggle
          action={{
            content: titleDescription,
            onAction: handleAction,
          }}
          enabled={true}
        >
          The banner script is{" "}
          <TextStyle variation="strong">{bodyDescription}</TextStyle>
        </SettingToggle>
      </Layout.AnnotatedSection>
    </Page>
  );
}

export default install;

import React, { useEffect } from 'react';
import { Box, Button, Card, CardHeader, CardBody, Paragraph } from "grommet";
import { Close } from 'grommet-icons';
import { RouterContext } from '../RouterContext';
import QRCode from 'qrcode';

const Invitation = ({close, data}) => {
    const { push } = React.useContext(RouterContext);
    const canvasref = React.useRef(null);
    console.log('INVITATION', close, data);

    useEffect(() => {
      if(canvasref && data){
        console.log('canvas', canvasref);
        QRCode.toCanvas(canvasref.current, JSON.stringify(data))
      }
    })
  
    const copyToClipBoard = () => {
      if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(JSON.stringify(data)).then(function() {
          console.log("Copied to clipboard successfully!");
        }, function() {
          console.error("Unable to write to clipboard. :-(");
        });
      } else {
        let textarea = document.createElement("textarea");
        textarea.textContent = JSON.stringify(data);
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
      }
      
    }
  return (
    <Box overflow="auto" align="center" flex="grow">
      <Card>
        <CardHeader align="center" direction="row" flex={false} justify="between" gap="medium" pad="small">
          <Box align="end" justify="center" flex="grow">
            <Button icon={<Close />} primary onClick={close}/>
          </Box>
        </CardHeader>
        <CardBody pad="small">
          <Box align="center" justify="center">
            <canvas ref={canvasref} id="qrcanvas"></canvas>
            <Paragraph>
              Kopioi alla oleva kutsu lompakkoosi.
            </Paragraph>
            <Box align="center" justify="center">
              <Paragraph id="invitation" style={{wordBreak:'break-all'}}>{JSON.stringify(data)}</Paragraph>
            </Box>
          </Box>
          <Box align="center" justify="center" flex="grow" direction="row" gap="medium">
            <Button label="Kopioi leikepöydälle" primary onClick={copyToClipBoard}/>
            <Button label="Peruuta" />
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}
export default Invitation;

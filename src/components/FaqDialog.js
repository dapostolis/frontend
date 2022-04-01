import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import AccordionItem from './AccordionItem';
import Typography from '@material-ui/core/Typography';
import {convertArrayToDictionaryBySelectedKey, convertArrayToDictionaryBySelectedKeyValue} from '../utils/generic';


const styles = theme => ({
  bodyTitle: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  bodySubtitle: {
    marginTop: 4,
    marginBottom: 0,
  },

  bullets: {
    '& > li:before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing.unit * 2 + 3,
      left: 0,
      width: 5,
      height: 5,
      backgroundColor: theme.palette.secondary.main,
    },
  },

  accordionItemContainer: {
    marginBottom: 18,
  },

  category: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  description: {
    whiteSpace: 'pre-line',
    padding: 12,
  },
});

function FaqDialog({classes, open, onHandleClose}) {
  const [faqs, setFaqs] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    let pRequests = [];

    pRequests.push(new Promise((resolve, reject) => {
      request.get(`${API}enum/Faq/Category/values`)
        .then(({data:categories}) => resolve(categories))
        .catch(error => reject(error));
    }));

    pRequests.push(new Promise((resolve, reject) => {
      request.get(`${API}faq/extendedlist`)
        .then(({data: {returnobject:faqs}}) => resolve(faqs))
        .catch(error => reject(error));
    }));


    Promise.all(pRequests)
      .then(([categories, faqs]) => {
        setCategories(convertArrayToDictionaryBySelectedKeyValue(categories, 'name', 'friendlyName'));
        setFaqs(convertArrayToDictionaryBySelectedKey(faqs, 'category'));
      })
      .catch(error => console.log(error));

  }, []);

  return (
    <Dialog
      id="faq-modal"
      open={open}
      onClose={onHandleClose}
      fullWidth={true}
    >
      <DialogTitle>FAQ</DialogTitle>
      <DialogContent id="scroll-area">
        <DialogContentText component="div">

          {Object.keys(faqs).map((faqIndex, faqKey) => (
            <div key={faqKey} className={classes.accordionItemContainer}>
              <Typography variant="h5" className={classes.category}>{categories[faqIndex]}</Typography>

              {faqs[faqIndex].list.map((faqItem, faqItemKey) =>
                <AccordionItem key={faqItemKey} title={faqItem.title}>
                  <Typography className={classes.description}>{faqItem.description}</Typography>
                </AccordionItem>
              )}
            </div>
          ))}

        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(FaqDialog);

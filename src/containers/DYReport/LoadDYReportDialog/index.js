import React, {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import ReportTable from './ReportTable';
import AlertDialog from 'components/AlertDialog';
import {useSnackbar} from 'notistack';


const styles = () => ({
  paperScrollPaper: {
    height: 'calc(100% - ' + 96 + 'px)', // todo make 96 dynamic
  }
});

function LoadDYReportDialog({classes, dyReportId, isOpened, onToggleDYReportDialog, onHandleClickUseDYReport, onHandleCloneDYReport}) {
  const [loading, setLoading] = useState(false);
  const [dYReports, setDYReports] = useState([]);
  const [selectedDYReport, setSelectedDYReport] = useState(null);
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    fetchDYReports();
  }, []);

  async function fetchDYReports() {
    setLoading(true);
    try {
      const {data: {returnobject: {content:dyReports}}} = await request.get(`${API}dyreport/?page=0&size=1000`);
      setDYReports(dyReports);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  function handleClose() {
    onToggleDYReportDialog();
  }

  function handleClickSelectDYReport(dyReport) {
    if (dyReport !== null) {
      if (selectedDYReport !== null && dyReport.id === selectedDYReport.id) {
        setSelectedDYReport(null);
      } else {
        setSelectedDYReport(dyReport);
      }
    }
  }

  function handleClickUseDYReport(dyReport) {
    let dy = dyReport || selectedDYReport;

    if (dy) {
      onHandleClickUseDYReport(dy);
      if (selectedDYReport) {
        setSelectedDYReport(null);
      }
      handleClose();
    }
  }

  async function handleClickClone() {

    try {
      if (!selectedDYReport) throw Error('No dyreport has been selected');

      const {data: {returnobject:clonedDyReport}} = await request.post(`${API}dyreport/${selectedDYReport.id}/clone`);

      if (clonedDyReport) {
        onHandleCloneDYReport(clonedDyReport);
        handleClose();
      } else {
        enqueueSnackbar('Something went wrong cloning ' + selectedDYReport.title + ' report', {variant: 'error'});
      }
    } catch (e) {
      console.log(e);
    }

  }

  //DELETE
  function handleResetDelItem() {
    setIsDeleteDialogOpened(false);
  }

  function handleDeleteConfirm() {
    setIsDeleteDialogOpened(true);
  }

  async function handleDeleteDYReport() {
    if (!selectedDYReport) {
      enqueueSnackbar('No selected Report. Please select one and retry', {variant: 'error'});
      return;
    }

    if (dyReportId === selectedDYReport.id) {
      enqueueSnackbar('The "' + selectedDYReport.title.slice(0, 20) + (selectedDYReport.title.length > 20 ? '...' : '') + '" report is already in use', {variant: 'warning'});
      return;
    }

    setLoading(true);
    try {
      await request.delete(`${API}dyreport/${selectedDYReport.id}`);
      fetchDYReports();
      setSelectedDYReport(null);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }
  //EoDELETE


  return (
    <Dialog fullWidth maxWidth="md" classes={{paperScrollPaper: classes.paperScrollPaper}} open={isOpened} onClose={handleClose}>
      <DialogTitle>Select Report</DialogTitle>

      <AlertDialog
        isOpened={isDeleteDialogOpened}
        onHandleClose={handleResetDelItem}
        yes={handleDeleteDYReport}
      />

      <DialogContent>
        <DialogContentText component="p">
          Use the table below to load or clone a Report.
        </DialogContentText>

        <ReportTable
          loading={loading}
          dYReports={dYReports}
          selectedDYReport={selectedDYReport}
          onHandleClickSelectReport={handleClickSelectDYReport}
          onHandleClickUseDYReport={handleClickUseDYReport}
          onHandleClickCloneReport={handleClickClone}
          onHandleDeleteDYReport={handleDeleteConfirm}
        />

      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(LoadDYReportDialog);
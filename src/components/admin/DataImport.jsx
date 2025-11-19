import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  FileDownload as DownloadIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
  GetApp as TemplateIcon,
} from '@mui/icons-material';
import { parseCSVFile, transformModels, validateCSVFile, downloadTemplate } from '../../services/data/importService.js';
import { importModels } from '../../services/api/supabase.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants.js';

/**
 * DataImport component for CSV file upload and processing
 */
const DataImport = ({ onImportComplete }) => {
  const theme = useTheme();
  const [file, setFile] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [importResult, setImportResult] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState([]);
  const [warnings, setWarnings] = React.useState([]);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewData, setPreviewData] = React.useState([]);

  // Handle file selection
  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file
    const validation = validateCSVFile(selectedFile);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setFile(selectedFile);
    setValidationErrors([]);
    setImportResult(null);
    setProgress(0);

    // Parse and preview file
    try {
      setIsProcessing(true);
      const csvResults = await parseCSVFile(selectedFile);
      const transformResult = transformModels(csvResults.data);
      
      setPreviewData(transformResult.models);
      setValidationErrors(transformResult.errors);
      setWarnings(transformResult.warnings);
      setShowPreview(true);
    } catch (error) {
      setValidationErrors([{ message: 'Failed to parse CSV: ' + error.message }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle drag and drop
  const handleDrop = React.useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect({ target: { files: [droppedFile] } });
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Process import
  const handleImport = async () => {
    if (!previewData.length || validationErrors.length > 0) {
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Import models (in real app, this would call Supabase)
      const result = await importModels(previewData);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.error) {
        setImportResult({
          success: false,
          message: result.error.message,
          recordsAdded: 0,
          recordsUpdated: 0,
        });
      } else {
        setImportResult({
          success: true,
          message: SUCCESS_MESSAGES.IMPORT_SUCCESS,
          recordsAdded: previewData.length,
          recordsUpdated: 0,
        });
      }

      // Notify parent component
      if (onImportComplete) {
        onImportComplete(importResult);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: error.message || ERROR_MESSAGES.IMPORT_ERROR,
        recordsAdded: 0,
        recordsUpdated: 0,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setWarnings([]);
    setImportResult(null);
    setShowPreview(false);
    setProgress(0);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Import LLM Model Data
      </Typography>

      {/* Upload Area */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          border: '2px dashed ' + theme.palette.divider,
          borderColor: file ? theme.palette.primary.main : theme.palette.divider,
          backgroundColor: file ? theme.palette.primary.light + '10' : 'transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <UploadIcon sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
          <Typography variant="h6">
            {file ? file.name : 'Drop your CSV file here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={isProcessing}
          >
            Select File
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileSelect}
            />
          </Button>
        </Box>
      </Paper>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Validation Errors ({validationErrors.length})
          </Typography>
          <List dense>
            {validationErrors.slice(0, 5).map((error, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <ErrorIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={'Row ' + error.row + ': ' + error.message}
                  secondary={error.field}
                />
              </ListItem>
            ))}
            {validationErrors.length > 5 && (
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary={'... and ' + (validationErrors.length - 5) + ' more errors'}
                />
              </ListItem>
            )}
          </List>
        </Alert>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Warnings ({warnings.length})
          </Typography>
          <List dense>
            {warnings.slice(0, 3).map((warning, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <WarningIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={'Row ' + warning.row + ': ' + warning.message}
                  secondary={warning.field}
                />
              </ListItem>
            ))}
            {warnings.length > 3 && (
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText
                  primary={'... and ' + (warnings.length - 3) + ' more warnings'}
                />
              </ListItem>
            )}
          </List>
        </Alert>
      )}

      {/* Progress Bar */}
      {isProcessing && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Processing... {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {/* Import Result */}
      {importResult && (
        <Alert 
          severity={importResult.success ? 'success' : 'error'}
          sx={{ mb: 2 }}
          action={
            <IconButton
              size="small"
              onClick={() => setImportResult(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {importResult.message}
          </Typography>
          {importResult.success && (
            <Typography variant="body2">
              Records added: {importResult.recordsAdded}
            </Typography>
          )}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadTemplate}
          disabled={isProcessing}
        >
          Download Template
        </Button>
        
        {file && (
          <>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={isProcessing}
            >
              Reset
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleImport}
              disabled={isProcessing || validationErrors.length > 0 || previewData.length === 0}
            >
              Import {previewData.length} Models
            </Button>
          </>
        )}
      </Box>

      {/* Data Preview */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Data Preview ({previewData.length} models)
        </DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Grid container spacing={1}>
              {previewData.slice(0, 10).map((model, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {model.model_name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                        <Chip label={model.provider} size="small" />
                        <Chip label={model.model_type} size="small" />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Input: ' + model.input_price_per_1M_tokens + '/1K tokens'
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Output: ' + model.output_price_per_1M_tokens + '/1K tokens'
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {previewData.length > 10 && (
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                ... and {previewData.length - 10} more models
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Instructions */}
      <Paper sx={{ p: 3, bgcolor: theme.palette.grey[50] }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Import Instructions
        </Typography>
        <Typography variant="body2" paragraph>
          1. Download the CSV template to ensure correct format
        </Typography>
        <Typography variant="body2" paragraph>
          2. Fill in your LLM model data following the template structure
        </Typography>
        <Typography variant="body2" paragraph>
          3. Upload the CSV file using the area above or drag and drop
        </Typography>
        <Typography variant="body2" paragraph>
          4. Review the preview and any validation errors
        </Typography>
        <Typography variant="body2">
          5. Click "Import" to add the data to the database
        </Typography>
      </Paper>
    </Box>
  );
};

export default DataImport;
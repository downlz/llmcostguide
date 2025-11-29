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

import { keyframes } from '@emotion/react';
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

  const pulseGlow = keyframes({
    '0%': {
      textShadow: '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(139, 0, 255, 0.3)',
    },
    '100%': {
      textShadow: '0 0 30px rgba(0, 245, 255, 0.8), 0 0 60px rgba(139, 0, 255, 0.6)',
    },
  });

  const shimmerWave = keyframes({
    '0%': {
      backgroundPosition: '-300% 0',
    },
    '100%': {
      backgroundPosition: '300% 0',
    },
  });

  const orbitParticles = keyframes({
    from: {
      transform: 'rotate(0deg) translateX(65px) rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg) translateX(65px) rotate(-360deg)',
    },
  });

  const particleDelays = ['0s', '1s', '2s', '3s'];

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
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 4 },
            mb: 3,
            mx: 'auto',
            width: { xs: 260, sm: 300, md: 340 },
            height: { xs: 220, sm: 260, md: 300 },
            borderRadius: 4,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow:
              '0 35px 60px -15px rgba(0, 0, 0, 0.5), ' +
              '0 0 0 1px rgba(255, 255, 255, 0.05), ' +
              'inset 0 1px 0 rgba(255, 255, 255, 0.1), ' +
              '0 10px 30px -5px rgba(0, 245, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle geometric patterns */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 25% 75%, rgba(120, 119, 198, 0.15) 0%, transparent 40%), ' +
                'radial-gradient(circle at 75% 25%, rgba(255, 119, 198, 0.15) 0%, transparent 40%), ' +
                'radial-gradient(circle at 45% 45%, rgba(59, 130, 246, 0.15) 0%, transparent 40%)',
              opacity: 0.7,
            }}
          />
          {/* Shimmering waves */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0, 245, 255, 0.08) 25%, rgba(139, 0, 255, 0.08) 50%, transparent 75%)',
              backgroundSize: '400% 100%',
              animation: `${shimmerWave} 4s linear infinite`,
            }}
          />
          {/* Radial Progress Ring */}
          <Box sx={{ position: 'relative', mb: { xs: 1, md: 2 }, width: { xs: 90, sm: 110, md: 130 }, height: '100%' }}>
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="bgGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
                  <stop offset="70%" stopColor="rgba(255, 255, 255, 0.03)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="progressGradient" x1="15%" y1="15%" x2="85%" y2="85%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="45%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b00ff" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#bgGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="5"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - progress / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{
                  transition: 'stroke-dashoffset 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
            </svg>
            {/* Central glowing orb */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: 22, md: 28 },
                height: { xs: 22, md: 28 },
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 40%, rgba(0, 245, 255, 0.8), transparent 60%), radial-gradient(circle, rgba(139, 0, 255, 0.6), transparent 70%)',
                boxShadow: '0 0 25px rgba(0, 245, 255, 0.7), 0 0 45px rgba(139, 0, 255, 0.5), inset 0 1px 5px rgba(255, 255, 255, 0.4)',
                animation: `${pulseGlow} 2s ease-in-out infinite`,
              }}
            />
          </Box>
          {/* Orbiting particles */}
          {particleDelays.map((delay, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 5,
                height: 5,
                borderRadius: '50%',
                margin: -2.5,
                background: 'radial-gradient(circle, #00f5ff 0%, #3b82f6 70%)',
                boxShadow: '0 0 15px rgba(0, 245, 255, 0.9)',
                animation: `${orbitParticles} 4s linear infinite`,
                animationDelay: delay,
              }}
            />
          ))}
          {/* Loading text */}
          <Typography
            variant={{ xs: 'h6', sm: 'h5' }}
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00f5ff 0%, #3b82f6 50%, #8b00ff 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              zIndex: 2,
              mb: 0.5,
              animation: `${pulseGlow} 1.8s ease-in-out infinite alternate`,
              filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.6))',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, Inter, Roboto, sans-serif',
            }}
          >
            Loading your data...
          </Typography>
          {/* Percentage */}
          <Typography
            variant={{ xs: 'h4', md: 'h3' }}
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #00f5ff 0%, #8b00ff 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              zIndex: 2,
              animation: `${pulseGlow} 1.8s ease-in-out infinite alternate-reverse`,
              filter: 'drop-shadow(0 0 25px rgba(0, 245, 255, 0.9))',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, Inter, Roboto, sans-serif',
            }}
          >
            {Math.round(progress)}%
          </Typography>
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
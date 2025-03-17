import React, { useState, useCallback, useMemo } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Alert,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Tabs,
    Tab,
    Tooltip,
    Menu,
    MenuItem,
    InputAdornment,
    Checkbox,
    TableSortLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LockIcon from '@mui/icons-material/Lock';
import ShareIcon from '@mui/icons-material/Share';
import HistoryIcon from '@mui/icons-material/History';
import RestoreIcon from '@mui/icons-material/Restore';
import PreviewIcon from '@mui/icons-material/Preview';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { IPFSService } from '../services/ipfs-service';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ListItemButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

const MotionCard = motion(Card);

interface FileVersion {
    cid: string;
    encryptedKey: string;
    uploadDate: string;
    size: number;
    versionNumber: number;
}

interface FileComment {
    id: string;
    userId: string;
    userAddress: string;
    text: string;
    timestamp: string;
}

interface CollaborationStatus {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
}

interface FileTag {
    id: string;
    name: string;
    color: string;
}

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    color: string;
}

interface StorageFile {
    id: string;
    name: string;
    type: string;
    currentVersion: number;
    versions: FileVersion[];
    status: 'Stored' | 'Processing' | 'Failed';
    shared: string[];
    comments: FileComment[];
    collaborators: {
        [address: string]: CollaborationStatus;
    };
    tags: FileTag[];
    folderId: string | null;
}

const DecentralizedStorage = () => {
    const { connected } = useWallet();
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [storageStats, setStorageStats] = useState({
        used: 0,
        total: 1000,
        files: 0
    });
    const [loading, setLoading] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
    const [previewTab, setPreviewTab] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [collaborationDialogOpen, setCollaborationDialogOpen] = useState(false);
    const [tags, setTags] = useState<FileTag[]>([
        { id: 'tag1', name: 'Important', color: '#f44336' },
        { id: 'tag2', name: 'Work', color: '#2196f3' },
        { id: 'tag3', name: 'Personal', color: '#4caf50' }
    ]);

    const [folders, setFolders] = useState<Folder[]>([
        { id: 'root', name: 'Root', parentId: null, color: '#9e9e9e' },
        { id: 'folder1', name: 'Documents', parentId: 'root', color: '#ffa726' },
        { id: 'folder2', name: 'Images', parentId: 'root', color: '#66bb6a' }
    ]);

    const [currentFolderId, setCurrentFolderId] = useState<string>('root');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagDialogOpen, setTagDialogOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#2196f3');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: 'name' | 'size' | 'uploadDate';
        direction: 'asc' | 'desc';
    }>({ key: 'name', direction: 'asc' });

    // Add IPFS service
    const ipfsService = new IPFSService();

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!connected) {
            setError('Please connect your wallet first');
            return;
        }

        const fileList = event.target.files;
        if (!fileList) return;

        setUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                setUploadProgress(25);

                const { cid, encryptedKey } = await ipfsService.uploadFile(file);
                setUploadProgress(75);

                // Check if file with same name exists
                const existingFile = files.find(f => f.name === file.name);

                if (existingFile) {
                    // Add new version
                    const newVersion: FileVersion = {
                        cid,
                        encryptedKey,
                        uploadDate: new Date().toISOString(),
                        size: file.size,
                        versionNumber: existingFile.versions.length
                    };

                    const updatedFile = {
                        ...existingFile,
                        currentVersion: newVersion.versionNumber,
                        versions: [...existingFile.versions, newVersion]
                    };

                    setFiles(prev => prev.map(f =>
                        f.id === existingFile.id ? updatedFile : f
                    ));
                } else {
                    // Create new file
                    const newFile: StorageFile = {
                        id: `file-${Date.now()}`,
                        name: file.name,
                        type: file.type,
                        currentVersion: 0,
                        versions: [{
                            cid,
                            encryptedKey,
                            uploadDate: new Date().toISOString(),
                            size: file.size,
                            versionNumber: 0
                        }],
                        status: 'Stored',
                        shared: [],
                        comments: [],
                        collaborators: {},
                        tags: [],
                        folderId: null
                    };

                    setFiles(prev => [...prev, newFile]);
                }

                // Update storage stats
                setStorageStats(prev => ({
                    ...prev,
                    used: prev.used + file.size / (1024 * 1024),
                    files: existingFile ? prev.files : prev.files + 1
                }));

                setUploadProgress(100);
            }
            setSuccess('Files uploaded successfully!');
        } catch (err) {
            setError('Failed to upload files: ' + (err as Error).message);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [connected, files]);

    const handleDelete = async (fileId: string) => {
        try {
            const file = files.find(f => f.id === fileId);
            if (file) {
                setFiles(prev => prev.filter(f => f.id !== fileId));
                setStorageStats(prev => ({
                    ...prev,
                    used: prev.used - file.versions[file.currentVersion - 1].size / (1024 * 1024),
                    files: prev.files - 1
                }));
                setSuccess('File deleted successfully');
            }
        } catch (err) {
            setError('Failed to delete file: ' + (err as Error).message);
        }
    };

    // Add download handler
    const handleDownload = async (file: StorageFile) => {
        try {
            setLoading(true);
            const content = await ipfsService.downloadFile(file.versions[file.currentVersion - 1].cid, file.versions[file.currentVersion - 1].encryptedKey);

            // Create and download the file
            const blob = new Blob([content], { type: file.type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Failed to download file: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Add file sharing handler
    const handleShare = async (file: StorageFile, recipientAddress: string) => {
        try {
            // Add recipient to shared list
            const updatedFile = {
                ...file,
                shared: [...file.shared, recipientAddress]
            };

            setFiles(prev => prev.map(f =>
                f.id === file.id ? updatedFile : f
            ));

            setSuccess(`File shared with ${recipientAddress}`);
        } catch (err) {
            setError('Failed to share file: ' + (err as Error).message);
        }
    };

    // Add ShareDialog component
    const ShareDialog = () => (
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
            <DialogTitle>Share File</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Recipient Wallet Address"
                    fullWidth
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                <Button
                    onClick={() => {
                        if (selectedFile) {
                            handleShare(selectedFile, recipientAddress);
                            setShareDialogOpen(false);
                            setRecipientAddress('');
                        }
                    }}
                    variant="contained"
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Add preview handler
    const handlePreview = async (file: StorageFile, version?: FileVersion) => {
        try {
            setLoading(true);
            const versionToPreview = version || file.versions[file.currentVersion];
            const content = await ipfsService.downloadFile(
                versionToPreview.cid,
                versionToPreview.encryptedKey
            );

            // Handle different file types
            if (file.type.startsWith('image/')) {
                const blob = new Blob([content], { type: file.type });
                setPreviewContent(URL.createObjectURL(blob));
            } else if (file.type.startsWith('text/')) {
                const text = new TextDecoder().decode(content);
                setPreviewContent(text);
            } else {
                setError('Preview not available for this file type');
                return;
            }

            setSelectedVersion(versionToPreview);
            setPreviewDialogOpen(true);
        } catch (err) {
            setError('Failed to preview file: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Add version restore handler
    const handleRestoreVersion = async (file: StorageFile, version: FileVersion) => {
        try {
            setLoading(true);
            // Update the current version
            const updatedFile = {
                ...file,
                currentVersion: version.versionNumber
            };

            setFiles(prev => prev.map(f =>
                f.id === file.id ? updatedFile : f
            ));

            setSuccess(`Restored version ${version.versionNumber}`);
        } catch (err) {
            setError('Failed to restore version: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Add comment handler
    const handleAddComment = async (file: StorageFile) => {
        if (!connected) {
            setError('Please connect your wallet first');
            return;
        }

        try {
            const newComment: FileComment = {
                id: `comment-${Date.now()}`,
                userId: 'current-user', // Replace with actual user ID
                userAddress: 'your-wallet-address', // Replace with actual wallet address
                text: commentText,
                timestamp: new Date().toISOString()
            };

            const updatedFile = {
                ...file,
                comments: [...file.comments, newComment]
            };

            setFiles(prev => prev.map(f =>
                f.id === file.id ? updatedFile : f
            ));

            setCommentText('');
            setSuccess('Comment added successfully');
        } catch (err) {
            setError('Failed to add comment: ' + (err as Error).message);
        }
    };

    // Add collaboration handler
    const handleUpdateCollaboration = async (
        file: StorageFile,
        collaboratorAddress: string,
        status: Partial<CollaborationStatus>
    ) => {
        try {
            const updatedFile = {
                ...file,
                collaborators: {
                    ...file.collaborators,
                    [collaboratorAddress]: {
                        ...file.collaborators[collaboratorAddress],
                        ...status
                    }
                }
            };

            setFiles(prev => prev.map(f =>
                f.id === file.id ? updatedFile : f
            ));

            setSuccess('Collaboration settings updated');
        } catch (err) {
            setError('Failed to update collaboration settings: ' + (err as Error).message);
        }
    };

    // Add PreviewDialog component
    const PreviewDialog = () => {
        if (!selectedFile) return null;

        const renderPreview = () => {
            if (!previewContent) return null;

            switch (selectedFile.type) {
                case 'application/pdf':
                    return (
                        <iframe
                            src={previewContent}
                            style={{ width: '100%', height: '500px' }}
                            title={selectedFile.name}
                        />
                    );
                case 'video/mp4':
                case 'video/webm':
                    return (
                        <video
                            controls
                            style={{ maxWidth: '100%', maxHeight: '500px' }}
                        >
                            <source src={previewContent} type={selectedFile.type} />
                            Your browser does not support the video tag.
                        </video>
                    );
                case 'audio/mpeg':
                case 'audio/wav':
                    return (
                        <audio
                            controls
                            style={{ width: '100%' }}
                        >
                            <source src={previewContent} type={selectedFile.type} />
                            Your browser does not support the audio tag.
                        </audio>
                    );
                // ... existing image and text previews ...
            }
        };

        return (
            <Dialog
                open={previewDialogOpen}
                onClose={() => {
                    setPreviewDialogOpen(false);
                    setPreviewContent(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">
                            {selectedFile.name}
                        </Typography>
                        <Tabs value={previewTab} onChange={(_, newValue) => setPreviewTab(newValue)}>
                            <Tab label="Preview" />
                            <Tab label="Version History" />
                            <Tab label="Comments" />
                        </Tabs>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {previewTab === 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            {renderPreview()}
                        </Box>
                    )}
                    {previewTab === 1 && (
                        <List>
                            {selectedFile.versions.map((version) => (
                                <ListItem
                                    key={version.versionNumber}
                                    selected={version.versionNumber === selectedFile.currentVersion}
                                >
                                    <ListItemText
                                        primary={`Version ${version.versionNumber}`}
                                        secondary={`Uploaded: ${new Date(version.uploadDate).toLocaleString()}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Preview Version">
                                            <IconButton
                                                edge="end"
                                                onClick={() => handlePreview(selectedFile, version)}
                                            >
                                                <PreviewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {version.versionNumber !== selectedFile.currentVersion && (
                                            <Tooltip title="Restore Version">
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleRestoreVersion(selectedFile, version)}
                                                >
                                                    <RestoreIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {previewTab === 2 && (
                        <Box>
                            <List>
                                {selectedFile.comments.map((comment) => (
                                    <ListItem key={comment.id}>
                                        <ListItemText
                                            primary={comment.text}
                                            secondary={`${comment.userAddress.slice(0, 6)}...${comment.userAddress.slice(-4)} - ${new Date(comment.timestamp).toLocaleString()}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => handleAddComment(selectedFile)}
                                    disabled={!commentText.trim()}
                                >
                                    Comment
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCollaborationDialogOpen(true)}>
                        Manage Collaborators
                    </Button>
                    <Button onClick={() => {
                        setPreviewDialogOpen(false);
                        setPreviewContent(null);
                    }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    // Add CollaborationDialog component
    const CollaborationDialog = () => {
        if (!selectedFile) return null;

        return (
            <Dialog
                open={collaborationDialogOpen}
                onClose={() => setCollaborationDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Manage Collaborators</DialogTitle>
                <DialogContent>
                    <List>
                        {Object.entries(selectedFile.collaborators).map(([address, status]) => (
                            <ListItem key={address}>
                                <ListItemText
                                    primary={address.slice(0, 6) + '...' + address.slice(-4)}
                                    secondary={
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Chip
                                                label="Can Edit"
                                                color={status.canEdit ? 'success' : 'default'}
                                                onClick={() => handleUpdateCollaboration(
                                                    selectedFile,
                                                    address,
                                                    { canEdit: !status.canEdit }
                                                )}
                                            />
                                            <Chip
                                                label="Can Comment"
                                                color={status.canComment ? 'success' : 'default'}
                                                onClick={() => handleUpdateCollaboration(
                                                    selectedFile,
                                                    address,
                                                    { canComment: !status.canComment }
                                                )}
                                            />
                                            <Chip
                                                label="Can Share"
                                                color={status.canShare ? 'success' : 'default'}
                                                onClick={() => handleUpdateCollaboration(
                                                    selectedFile,
                                                    address,
                                                    { canShare: !status.canShare }
                                                )}
                                            />
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCollaborationDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    };

    // Add folder navigation breadcrumb data
    const getBreadcrumbPath = (folderId: string): Folder[] => {
        const path: Folder[] = [];
        let currentFolder = folders.find(f => f.id === folderId);

        while (currentFolder) {
            path.unshift(currentFolder);
            currentFolder = folders.find(f => f.id === currentFolder?.parentId);
        }

        return path;
    };

    // Filter files based on current folder, search, and tags
    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            const matchesFolder = file.folderId === currentFolderId;
            const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tagId => file.tags.some(t => t.id === tagId));

            return matchesFolder && matchesSearch && matchesTags;
        });
    }, [files, currentFolderId, searchQuery, selectedTags]);

    // Add tag management handlers
    const handleCreateTag = () => {
        const newTag: FileTag = {
            id: `tag-${Date.now()}`,
            name: newTagName,
            color: newTagColor
        };
        setTags(prev => [...prev, newTag]);
        setNewTagName('');
        setTagDialogOpen(false);
    };

    const handleAddTagToFile = (file: StorageFile, tagId: string) => {
        const tag = tags.find(t => t.id === tagId);
        if (!tag) return;

        const updatedFile = {
            ...file,
            tags: [...file.tags, tag]
        };

        setFiles(prev => prev.map(f =>
            f.id === file.id ? updatedFile : f
        ));
    };

    // Add folder management handlers
    const handleCreateFolder = (name: string, parentId: string = currentFolderId) => {
        const newFolder: Folder = {
            id: `folder-${Date.now()}`,
            name,
            parentId,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };
        setFolders(prev => [...prev, newFolder]);
    };

    // Add these components
    const FolderBreadcrumb = () => {
        const path = getBreadcrumbPath(currentFolderId);

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {path.map((folder, index) => (
                    <React.Fragment key={folder.id}>
                        {index > 0 && <Typography sx={{ mx: 1 }}>/</Typography>}
                        <Button
                            onClick={() => setCurrentFolderId(folder.id)}
                            sx={{
                                color: folder.color,
                                textTransform: 'none'
                            }}
                        >
                            {folder.name}
                        </Button>
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    const TagsFilter = () => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Filter by Tags</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.map(tag => (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        sx={{ backgroundColor: tag.color }}
                        onClick={() => {
                            setSelectedTags(prev =>
                                prev.includes(tag.id)
                                    ? prev.filter(id => id !== tag.id)
                                    : [...prev, tag.id]
                            );
                        }}
                        variant={selectedTags.includes(tag.id) ? 'filled' : 'outlined'}
                    />
                ))}
                <Chip
                    icon={<AddIcon />}
                    label="New Tag"
                    onClick={() => setTagDialogOpen(true)}
                    variant="outlined"
                />
            </Box>
        </Box>
    );

    // Add CreateTagDialog component
    const CreateTagDialog = () => (
        <Dialog
            open={tagDialogOpen}
            onClose={() => setTagDialogOpen(false)}
        >
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Tag Name"
                    fullWidth
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Tag Color
                    </Typography>
                    <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setTagDialogOpen(false)}>Cancel</Button>
                <Button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    variant="contained"
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Add bulk operation handlers
    const handleBulkDelete = async () => {
        try {
            setLoading(true);
            await Promise.all(
                selectedItems.map(fileId => handleDelete(fileId))
            );
            setSelectedItems([]);
            setSuccess('Bulk delete successful');
        } catch (err) {
            setError('Failed to delete selected items');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkMove = async (targetFolderId: string) => {
        try {
            setLoading(true);
            const updatedFiles = files.map(file =>
                selectedItems.includes(file.id)
                    ? { ...file, folderId: targetFolderId }
                    : file
            );
            setFiles(updatedFiles);
            setSelectedItems([]);
            setSuccess('Files moved successfully');
        } catch (err) {
            setError('Failed to move files');
        } finally {
            setLoading(false);
        }
    };

    // Add drag and drop handler
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const fileId = result.draggableId;
        const targetFolderId = destination.droppableId;

        if (source.droppableId !== destination.droppableId) {
            handleBulkMove(targetFolderId);
        }
    };

    // Add sorting handler
    const handleSort = (key: 'name' | 'size' | 'uploadDate') => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Update the filtered and sorted files
    const sortedAndFilteredFiles = useMemo(() => {
        return [...filteredFiles].sort((a, b) => {
            const { key, direction } = sortConfig;
            let comparison = 0;

            switch (key) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'size':
                    comparison = a.versions[a.currentVersion].size - b.versions[b.currentVersion].size;
                    break;
                case 'uploadDate':
                    comparison = new Date(a.versions[a.currentVersion].uploadDate).getTime() -
                        new Date(b.versions[b.currentVersion].uploadDate).getTime();
                    break;
            }

            return direction === 'asc' ? comparison : -comparison;
        });
    }, [filteredFiles, sortConfig]);

    // Add bulk operations menu
    const BulkOperationsMenu = () => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

        return (
            <>
                <Button
                    variant="contained"
                    disabled={selectedItems.length === 0}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<MoreVertIcon />}
                >
                    Bulk Actions ({selectedItems.length})
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={handleBulkDelete}>
                        <DeleteIcon sx={{ mr: 1 }} /> Delete Selected
                    </MenuItem>
                    <MenuItem onClick={() => setAnchorEl(null)}>
                        <DriveFileMoveIcon sx={{ mr: 1 }} /> Move Selected
                    </MenuItem>
                    <MenuItem onClick={() => setAnchorEl(null)}>
                        <ShareIcon sx={{ mr: 1 }} /> Share Selected
                    </MenuItem>
                </Menu>
            </>
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container maxWidth="lg">
                <Box sx={{ py: 8 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 6
                        }}
                    >
                        Decentralized Storage
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <WalletMultiButton />
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 4 }}>
                            {success}
                        </Alert>
                    )}

                    <Box sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 3 }}
                        />

                        <FolderBreadcrumb />
                        <TagsFilter />
                    </Box>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={4}>
                            <MotionCard
                                whileHover={{ scale: 1.02 }}
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <StorageIcon sx={{ fontSize: 40, mr: 2 }} />
                                        <Typography variant="h6">Storage Usage</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(storageStats.used / storageStats.total) * 100}
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography variant="body2">
                                        {storageStats.used.toFixed(2)} MB / {storageStats.total} MB
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <MotionCard
                                whileHover={{ scale: 1.02 }}
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <FolderIcon sx={{ fontSize: 40, mr: 2 }} />
                                        <Typography variant="h6">Files Stored</Typography>
                                    </Box>
                                    <Typography variant="h4">{storageStats.files}</Typography>
                                </CardContent>
                            </MotionCard>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <MotionCard
                                whileHover={{ scale: 1.02 }}
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LockIcon sx={{ fontSize: 40, mr: 2 }} />
                                        <Typography variant="h6">Encryption</Typography>
                                    </Box>
                                    <Chip label="End-to-End Encrypted" color="success" />
                                </CardContent>
                            </MotionCard>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Button
                            variant="contained"
                            startIcon={<CreateNewFolderIcon />}
                            onClick={() => {
                                const name = prompt('Enter folder name');
                                if (name) handleCreateFolder(name);
                            }}
                        >
                            New Folder
                        </Button>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload">
                            <Button
                                component="span"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                disabled={!connected || uploading}
                            >
                                {uploading ? <CircularProgress size={24} /> : 'Upload Files'}
                            </Button>
                        </label>
                        <BulkOperationsMenu />
                    </Box>

                    <Droppable droppableId={currentFolderId}>
                        {(provided) => (
                            <TableContainer
                                component={Paper}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selectedItems.length > 0 && selectedItems.length < sortedAndFilteredFiles.length}
                                                    checked={selectedItems.length === sortedAndFilteredFiles.length}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedItems(sortedAndFilteredFiles.map(f => f.id));
                                                        } else {
                                                            setSelectedItems([]);
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'name'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('name')}
                                                >
                                                    Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Tags</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Upload Date</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedAndFilteredFiles.map((file, index) => (
                                            <Draggable
                                                key={file.id}
                                                draggableId={file.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={selectedItems.includes(file.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedItems(prev => [...prev, file.id]);
                                                                    } else {
                                                                        setSelectedItems(prev => prev.filter(id => id !== file.id));
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{file.name}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                {file.tags.map(tag => (
                                                                    <Chip
                                                                        key={tag.id}
                                                                        label={tag.name}
                                                                        size="small"
                                                                        sx={{ backgroundColor: tag.color }}
                                                                    />
                                                                ))}
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(event) => {
                                                                        setSelectedFile(file);
                                                                        setTagDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <AddIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{(file.versions[file.currentVersion - 1].size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                                                        <TableCell>
                                                            {new Date(file.versions[file.currentVersion - 1].uploadDate).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={file.status}
                                                                color={file.status === 'Stored' ? 'success' : 'warning'}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                onClick={() => handlePreview(file)}
                                                                size="small"
                                                            >
                                                                <PreviewIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleDownload(file)}
                                                                size="small"
                                                            >
                                                                <FileDownloadIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setSelectedFile(file);
                                                                    setShareDialogOpen(true);
                                                                }}
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <ShareIcon />
                                                            </IconButton>
                                                            <Tooltip title={`${file.versions.length} versions`}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        setSelectedFile(file);
                                                                        setPreviewTab(1);
                                                                        setPreviewDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <HistoryIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <IconButton
                                                                onClick={() => handleDelete(file.id)}
                                                                size="small"
                                                                color="error"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Droppable>
                </Box>
                <ShareDialog />
                <PreviewDialog />
                <CollaborationDialog />
                <CreateTagDialog />
            </Container>
        </DragDropContext>
    );
};

export default DecentralizedStorage; 
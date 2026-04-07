// Glass Inventory Management System
class GlassInventory {
    constructor() {
        this.inventory = this.loadInventory();
        this.predefinedModels = [
            'Realme 5',
            'F19',
            '6i',
            '9i',
            'Note 9 Pro',
            'C55',
            'MI 12',
            'Samsung A35 / M35 / F35',
            'CE2 Lite',
            'Note 9',
            'Nothing CMF',
            'Nothing 2A / 2A+',
            'Nothing 3A / 3A Pro',
            'Reno 13 / 14',
            'V20',
            'V20 Pro',
            'Samsung A30',
            '5 Pro',
            'Y91',
            'Y19',
            'Y11 / Y12',
            'Samsung F15',
            'Note 7',
            'Vivo S1',
            'Redmi 9A',
            'Redmi 10C',
            'Redmi 14C',
            'Samsung A26',
            'Samsung A14',
            'Realme C53',
            'Samsung S20',
            'iPhone 11',
            'iPhone 12',
            'iPhone 13',
            'iPhone 14 Pro',
            'iPhone 16 Pro',
            'iPhone 11 Pro Max',
            'iPhone 12 Pro Max',
            'iPhone 13 Pro Max',
            'iPhone 15 Pro',
            'iPhone 16 Pro Max'
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.registerServiceWorker();
        this.showInstallPrompt();
    }

    // Register Service Worker for PWA functionality
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // Show install prompt for PWA
    showInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button after a delay
            setTimeout(() => {
                this.showInstallButton(deferredPrompt);
            }, 3000);
        });
    }

    showInstallButton(deferredPrompt) {
        const installBtn = document.createElement('button');
        installBtn.innerHTML = '📱 Install App';
        installBtn.className = 'install-btn';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            z-index: 1000;
            animation: pulse 2s infinite;
        `;
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBtn.remove();
            }
        });
        
        document.body.appendChild(installBtn);
    }

    setupEventListeners() {
        // Main buttons
        document.getElementById('addBtn').addEventListener('click', () => this.showAddModal());
        document.getElementById('removeBtn').addEventListener('click', () => this.showRemoveModal());
        document.getElementById('addVariantBtn').addEventListener('click', () => this.showAddVariantModal());
        document.getElementById('listBtn').addEventListener('click', () => this.showListModal());

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                this.closeModal();
            }
        });
    }

    // Local Storage Management
    loadInventory() {
        const stored = localStorage.getItem('glassInventory');
        return stored ? JSON.parse(stored) : {};
    }

    saveInventory() {
        localStorage.setItem('glassInventory', JSON.stringify(this.inventory));
    }

    // Modal Management
    showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Add Functionality
    showAddModal() {
        const allModels = [...new Set([...this.predefinedModels, ...Object.keys(this.inventory)])];
        const searchBox = `
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="modelSearch" placeholder="Search models..." autocomplete="off">
            </div>
        `;
        
        const content = `
            ${searchBox}
            <div class="form-group">
                <label for="modelSelect">Select Model:</label>
                <select id="modelSelect" required>
                    <option value="">Choose a model...</option>
                    ${allModels.map(model => `<option value="${model}">${model}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="addQuantity">Quantity to Add:</label>
                <input type="number" id="addQuantity" min="1" value="1" required>
            </div>
            <button class="btn" onclick="glassInventory.addToInventory()">Add to Inventory</button>
        `;
        
        this.showModal('Add Glass', content);
        this.setupSearchFilter();
    }

    setupSearchFilter() {
        const searchInput = document.getElementById('modelSearch');
        const modelSelect = document.getElementById('modelSelect');
        
        if (searchInput && modelSelect) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const options = modelSelect.querySelectorAll('option');
                
                options.forEach(option => {
                    if (option.value === '') return;
                    const matches = option.value.toLowerCase().includes(searchTerm);
                    option.style.display = matches ? 'block' : 'none';
                });
            });
        }
    }

    addToInventory() {
        const modelSelect = document.getElementById('modelSelect');
        const quantityInput = document.getElementById('addQuantity');
        
        if (!modelSelect.value || !quantityInput.value) {
            this.showMessage('Please select a model and enter quantity', 'error');
            return;
        }
        
        const model = modelSelect.value;
        const quantity = parseInt(quantityInput.value);
        
        if (quantity <= 0) {
            this.showMessage('Quantity must be greater than 0', 'error');
            return;
        }
        
        // Add to inventory
        this.inventory[model] = (this.inventory[model] || 0) + quantity;
        this.saveInventory();
        
        this.showMessage(`Added ${quantity} ${model}(s) to inventory`, 'success');
        
        // Reset form
        modelSelect.value = '';
        quantityInput.value = '1';
        
        // Close modal after a short delay
        setTimeout(() => this.closeModal(), 1500);
    }

    // Remove Functionality
    showRemoveModal() {
        const allModels = Object.keys(this.inventory);
        
        if (allModels.length === 0) {
            const content = `
                <div class="empty-state">
                    <p>No items in inventory to remove.</p>
                    <button class="btn" onclick="glassInventory.closeModal()">Close</button>
                </div>
            `;
            this.showModal('Remove Glass', content);
            return;
        }
        
        const searchBox = `
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="removeModelSearch" placeholder="Search models..." autocomplete="off">
            </div>
        `;
        
        const content = `
            ${searchBox}
            <div class="form-group">
                <label for="removeModelSelect">Select Model:</label>
                <select id="removeModelSelect" required>
                    <option value="">Choose a model...</option>
                    ${allModels.map(model => `<option value="${model}">${model} (Current: ${this.inventory[model]})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="removeQuantity">Quantity to Remove:</label>
                <input type="number" id="removeQuantity" min="1" value="1" required>
            </div>
            <button class="btn btn-danger" onclick="glassInventory.removeFromInventory()">Remove from Inventory</button>
        `;
        
        this.showModal('Remove Glass', content);
        this.setupRemoveSearchFilter();
    }

    setupRemoveSearchFilter() {
        const searchInput = document.getElementById('removeModelSearch');
        const modelSelect = document.getElementById('removeModelSelect');
        
        if (searchInput && modelSelect) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const options = modelSelect.querySelectorAll('option');
                
                options.forEach(option => {
                    if (option.value === '') return;
                    const matches = option.value.toLowerCase().includes(searchTerm);
                    option.style.display = matches ? 'block' : 'none';
                });
            });
        }
    }

    removeFromInventory() {
        const modelSelect = document.getElementById('removeModelSelect');
        const quantityInput = document.getElementById('removeQuantity');
        
        if (!modelSelect.value || !quantityInput.value) {
            this.showMessage('Please select a model and enter quantity', 'error');
            return;
        }
        
        const model = modelSelect.value;
        const quantity = parseInt(quantityInput.value);
        const currentQuantity = this.inventory[model];
        
        if (quantity <= 0) {
            this.showMessage('Quantity must be greater than 0', 'error');
            return;
        }
        
        if (quantity > currentQuantity) {
            this.showMessage(`Cannot remove ${quantity} items. Only ${currentQuantity} available.`, 'error');
            return;
        }
        
        // Remove from inventory
        this.inventory[model] = currentQuantity - quantity;
        
        // Remove from inventory if quantity becomes 0
        if (this.inventory[model] === 0) {
            delete this.inventory[model];
        }
        
        this.saveInventory();
        
        this.showMessage(`Removed ${quantity} ${model}(s) from inventory`, 'success');
        
        // Reset form
        modelSelect.value = '';
        quantityInput.value = '1';
        
        // Close modal after a short delay
        setTimeout(() => this.closeModal(), 1500);
    }

    // Add Variant Functionality
    showAddVariantModal() {
        const content = `
            <div class="form-group">
                <label for="newModelName">New Model Name:</label>
                <input type="text" id="newModelName" placeholder="Enter model name..." required>
            </div>
            <div class="form-group">
                <label for="initialQuantity">Initial Quantity:</label>
                <input type="number" id="initialQuantity" min="1" value="1" required>
            </div>
            <button class="btn" onclick="glassInventory.addVariant()">Add New Model</button>
        `;
        
        this.showModal('Add New Variant', content);
    }

    addVariant() {
        const modelNameInput = document.getElementById('newModelName');
        const quantityInput = document.getElementById('initialQuantity');
        
        const modelName = modelNameInput.value.trim();
        const quantity = parseInt(quantityInput.value);
        
        if (!modelName) {
            this.showMessage('Please enter a model name', 'error');
            return;
        }
        
        if (quantity <= 0) {
            this.showMessage('Quantity must be greater than 0', 'error');
            return;
        }
        
        // Check if model already exists
        if (this.inventory[modelName]) {
            this.showMessage('This model already exists in inventory', 'error');
            return;
        }
        
        // Add new variant
        this.inventory[modelName] = quantity;
        this.saveInventory();
        
        this.showMessage(`Added new model "${modelName}" with ${quantity} items`, 'success');
        
        // Reset form
        modelNameInput.value = '';
        quantityInput.value = '1';
        
        // Close modal after a short delay
        setTimeout(() => this.closeModal(), 1500);
    }

    // Overall List Functionality
    showListModal() {
        // Show all predefined models alphabetically, plus any custom variants
        const allModels = [...new Set([...this.predefinedModels, ...Object.keys(this.inventory)])];
        const sortedModels = allModels.sort();
        
        let tableRows = '';
        let totalItems = 0;
        let modelsWithStock = 0;
        
        sortedModels.forEach(model => {
            const quantity = this.inventory[model] || 0;
            totalItems += quantity;
            if (quantity > 0) modelsWithStock++;
            
            // Add different styling for items with 0 quantity
            const quantityClass = quantity === 0 ? 'quantity-badge zero' : 'quantity-badge';
            const rowClass = quantity === 0 ? 'zero-stock' : '';
            
            tableRows += `
                <tr class="${rowClass}">
                    <td>${model}</td>
                    <td><span class="${quantityClass}">${quantity}</span></td>
                </tr>
            `;
        });
        
        const content = `
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="listSearch" placeholder="Search inventory..." autocomplete="off">
            </div>
            <div style="margin-bottom: 20px;">
                <strong>Total Models:</strong> ${allModels.length} | 
                <strong>Total Items:</strong> ${totalItems}
            </div>
            <table class="inventory-table" id="inventoryTable">
                <thead>
                    <tr>
                        <th>Model Name</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    ${tableRows}
                </tbody>
            </table>
            <button class="btn btn-secondary" onclick="glassInventory.closeModal()" style="margin-top: 20px;">Close</button>
        `;
        
        this.showModal('Overall Inventory List', content);
        this.setupListSearch();
    }

    setupListSearch() {
        const searchInput = document.getElementById('listSearch');
        const tableBody = document.getElementById('tableBody');
        
        if (searchInput && tableBody) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const modelName = row.cells[0].textContent.toLowerCase();
                    const matches = modelName.includes(searchTerm);
                    row.style.display = matches ? '' : 'none';
                });
            });
        }
    }

    // Message Display
    showMessage(message, type = 'info') {
        const modalBody = document.querySelector('.modal-body');
        const existingMessage = modalBody.querySelector('.message');
        
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        modalBody.insertBefore(messageDiv, modalBody.firstChild);
        
        // Auto-remove message after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Initialize the application
const glassInventory = new GlassInventory();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        glassInventory.closeModal();
    }
    
    // Ctrl/Cmd + A for Add
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        glassInventory.showAddModal();
    }
    
    // Ctrl/Cmd + R for Remove
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        glassInventory.showRemoveModal();
    }
    
    // Ctrl/Cmd + L for List
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        glassInventory.showListModal();
    }
});

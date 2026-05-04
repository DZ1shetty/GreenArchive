document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gridContainer = document.getElementById('grid-container');
    const modal = document.getElementById('modal');
    const addBtn = document.getElementById('add-btn');
    const closeBtns = document.querySelectorAll('.close-btn, .close-btn-action');
    const form = document.getElementById('specimen-form');
    const modalTitle = document.getElementById('modal-title');
    const filterCare = document.getElementById('filter-care');
    const searchInput = document.getElementById('search-input');
    const statTotal = document.getElementById('stat-total');
    const statWater = document.getElementById('stat-water');
    const statHighCare = document.getElementById('stat-high-care');
    
    // Custom Confirm Modal Elements
    const confirmModal = document.getElementById('confirm-modal');
    const confirmCancel = document.getElementById('confirm-cancel');
    const confirmDelete = document.getElementById('confirm-delete');
    
    // Detailed Drawer Elements
    const drawer = document.getElementById('drawer');
    const drawerClose = document.querySelector('.drawer-close');
    
    let allSpecimens = [];
    let specimenToDelete = null;


    // Fetch and Render Specimens
    async function loadSpecimens() {
        try {
            gridContainer.innerHTML = '<div class="loading">Inquiring the digital herbarium...</div>';
            const response = await fetch('/api/specimens');
            const data = await response.json();
            allSpecimens = data;
            renderSpecimens(data);
            updateStats(data);
        } catch (error) {
            console.error('Error loading specimens:', error);
            gridContainer.innerHTML = '<div class="loading">Failed to load specimens. Please ensure the server is running.</div>';
        }
    }

    // Render cards to the grid
    function renderSpecimens(specimens) {
        if (specimens.length === 0) {
            const activeFilter = filterCare.value || searchInput.value;
            gridContainer.innerHTML = activeFilter 
                ? '<div class="loading">No specimens match your search criteria.</div>'
                : '<div class="loading">No specimens logged yet. Click "+ Add Specimen" to begin your archive.</div>';
            return;
        }

        gridContainer.innerHTML = ''; // clear grid

        specimens.forEach((specimen, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${index * 0.08}s`;
            card.innerHTML = `
                <div class="card-content-wrap">
                    <div class="card-header">
                        <h3 class="card-title">${specimen.name}</h3>
                        ${specimen.scientificName ? `<p class="card-subtitle">${specimen.scientificName}</p>` : ''}
                    </div>
                    <div class="card-body">
                        <div class="tag-list">
                            <span class="tag ${getCareClass(specimen.careLevel)}">${specimen.careLevel} Care</span>
                            <span class="tag">${specimen.sunlight} Light</span>
                        </div>
                        <p><strong>Watering:</strong> Every ${specimen.waterFrequency} days</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-secondary btn-sm edit-btn" data-id="${specimen._id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${specimen._id}">Delete</button>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        setupCardActions();
    }

    // Assign dynamic classes for Care levels
    function getCareClass(level) {
        if (level === 'High') return 'tag-care-high';
        if (level === 'Medium') return 'tag-care-med';
        return 'tag-care-low';
    }

    // Update statistics dashboard
    function updateStats(specimens) {
        statTotal.textContent = specimens.length;
        
        // Count high care
        const highCareCount = specimens.filter(s => s.careLevel === 'High').length;
        statHighCare.textContent = highCareCount;

        // Custom Needs water logic (just a Mock count for visual feedback)
        const needsWaterCount = specimens.filter(s => s.waterFrequency <= 5).length;
        statWater.textContent = needsWaterCount;
    }

    // Filter Functionality
    function applyFilters() {
        const careVal = filterCare.value;
        const searchVal = searchInput.value.toLowerCase();

        let filtered = allSpecimens;

        if (careVal) {
            filtered = filtered.filter(s => s.careLevel === careVal);
        }

        if (searchVal) {
            filtered = filtered.filter(s => 
                s.name.toLowerCase().includes(searchVal) || 
                (s.scientificName && s.scientificName.toLowerCase().includes(searchVal))
            );
        }

        renderSpecimens(filtered);
    }

    filterCare.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    // Modal Control: Show
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('specimen-id').value = '';
        modalTitle.textContent = 'Log New Specimen';
        modal.classList.add('active'); // Smooth active
        
        // Fix: Close Drawer on Add
        if (drawer) drawer.classList.remove('active');
    });

    // Modal Control: Hide
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
        if (e.target === confirmModal) {
            confirmModal.classList.remove('active');
            specimenToDelete = null;
        }
    });

    // Dictionary of popular plants to autofill scientific name
    const plantDatabase = {
        "Monstera Deliciosa": "Monstera deliciosa Liebm.",
        "Snake Plant": "Dracaena trifasciata",
        "Calathea Ornata": "Goeppertia ornata",
        "Fiddle Leaf Fig": "Ficus lyrata",
        "Spider Plant": "Chlorophytum comosum",
        "Aloe Vera": "Aloe barbadensis miller",
        "Peace Lily": "Spathiphyllum wallisii",
        "ZZ Plant": "Zamioculcas zamiifolia",
        "Rubber Plant": "Ficus elastica",
        "Pothos": "Epipremnum aureum"
    };

    // Auto-fill scientific name based on common name selection
    document.getElementById('name').addEventListener('input', (e) => {
        const commonName = e.target.value;
        const scientificField = document.getElementById('scientificName');
        
        // Auto-fill if there is a match in our database
        if (plantDatabase[commonName]) {
            scientificField.value = plantDatabase[commonName];
            
            // Subtle pulse animation to show it was auto-filled
            scientificField.style.transition = 'background-color 0.3s';
            scientificField.style.backgroundColor = '#e8f5e9';
            setTimeout(() => {
                scientificField.style.backgroundColor = '';
            }, 600);
        }
    });

    // Handle Card Action setup (Add after render)
    function setupCardActions() {
        // Edit Button Click
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const specimen = allSpecimens.find(s => s._id === id);
                if (specimen) {
                    // Populate Form
                    document.getElementById('specimen-id').value = specimen._id;
                    document.getElementById('name').value = specimen.name;
                    document.getElementById('scientificName').value = specimen.scientificName || '';
                    document.getElementById('careLevel').value = specimen.careLevel;
                    document.getElementById('sunlight').value = specimen.sunlight;
                    document.getElementById('waterFrequency').value = specimen.waterFrequency;
                    document.getElementById('notes').value = specimen.notes || '';

                    modalTitle.textContent = 'Edit Specimen Log';
                    modal.classList.add('active'); // Smooth active

                    // Fix: Close Drawer on Edit
                    if (drawer) drawer.classList.remove('active');
                }
            });
        });

        // Delete Button Click
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                specimenToDelete = e.target.getAttribute('data-id');
                const specimen = allSpecimens.find(s => s._id === specimenToDelete);
                
                if (specimen) {
                    document.getElementById('confirm-title').textContent = `Archive ${specimen.name}?`;
                    confirmModal.classList.add('active');
                }
            });
        });

        // Confirm Modal Actions
        confirmCancel.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            specimenToDelete = null;
        });

        confirmDelete.addEventListener('click', async () => {
            if (specimenToDelete) {
                try {
                    const response = await fetch(`/api/specimens/${specimenToDelete}`, { method: 'DELETE' });
                    if (response.ok) {
                        confirmModal.classList.remove('active');
                        loadSpecimens(); // Reload
                        
                        // Fix: Clear Split View on Delete
                        const splitContainer = document.querySelector('.split-view-container');
                        if (splitContainer) splitContainer.classList.remove('split-active');
                    } else {
                        alert('Failed to delete specimen.');
                    }
                } catch (error) {
                    console.error('Error deleting:', error);
                } finally {
                    specimenToDelete = null;
                }
            }
        });

        // Open Detailed Drawer on Card Click
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const isButton = e.target.tagName === 'BUTTON' || e.target.closest('button');
                if (isButton) return; // Prevent drawer opening on Edit/Delete

                const id = card.querySelector('.edit-btn').getAttribute('data-id');
                const specimen = allSpecimens.find(s => s._id === id);

                if (specimen) {
                    document.getElementById('drawer-name').textContent = specimen.name;
                    document.getElementById('drawer-scientific').textContent = specimen.scientificName || 'N/A';
                    document.getElementById('drawer-care').textContent = specimen.careLevel;
                    document.getElementById('drawer-sunlight').textContent = specimen.sunlight;
                    document.getElementById('drawer-water').textContent = `Every ${specimen.waterFrequency} days`;
                    document.getElementById('drawer-notes').textContent = specimen.notes || 'No logs recorded.';

                    // Trigger Split View
                    const splitContainer = document.querySelector('.split-view-container');
                    if (splitContainer) splitContainer.classList.add('split-active');
                }
            });
        });

        // Close Drawer Actions
        if (drawerClose) {
            drawerClose.addEventListener('click', () => {
                const splitContainer = document.querySelector('.split-view-container');
                if (splitContainer) splitContainer.classList.remove('split-active');
            });
        }
        
        window.addEventListener('click', (e) => {
            const splitContainer = document.querySelector('.split-view-container');
            if (splitContainer && splitContainer.classList.contains('split-active')) {
                const pane = document.getElementById('drawer');
                // Close if click is completely outside container grid panel 
                if (!pane.contains(e.target) && !e.target.closest('.card') && !e.target.closest('.modal')) {
                    splitContainer.classList.remove('split-active');
                }
            }
        });
    }

    // Form Submit (Create or Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('specimen-id').value;
        const payload = {
            name: document.getElementById('name').value,
            scientificName: document.getElementById('scientificName').value,
            careLevel: document.getElementById('careLevel').value,
            sunlight: document.getElementById('sunlight').value,
            waterFrequency: Number(document.getElementById('waterFrequency').value),
            notes: document.getElementById('notes').value
        };




        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/specimens/${id}` : '/api/specimens';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                modal.classList.remove('active'); // Smooth close
                loadSpecimens(); // Reload specimens
            } else {
                const err = await response.json();
                alert(`Error: ${err.details || err.error}`);
            }
        } catch (error) {
            console.error('Error saving specimen:', error);
            alert('Failed to save specimen.');
        }
    });

    // Initial Load
    loadSpecimens();
});

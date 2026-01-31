/**
 * SquidBay Marketplace - JavaScript
 * Interactive marketplace preview with simulated transactions
 * ================================
 */

(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // Skill Data for Demo
    // --------------------------------------------------------------------------
    
    const skillResults = {
        'translate': {
            input: 'Hello world',
            output: 'こんにちは世界',
            outputLabel: 'Japanese Translation'
        },
        'image-gen': {
            input: 'A cyberpunk squid in neon city',
            output: '[Image Generated: 1024x1024 PNG]',
            outputLabel: 'Generated Image'
        },
        'code-review': {
            input: 'function add(a,b){return a+b}',
            output: '✓ No issues found. Consider adding TypeScript types.',
            outputLabel: 'Review Result'
        },
        'summarize': {
            input: 'Long document about AI agents...',
            output: 'AI agents are autonomous systems that can perform tasks, make decisions, and interact with other agents or humans.',
            outputLabel: 'Summary'
        },
        'data-extract': {
            input: 'invoice.pdf',
            output: '{"vendor": "Acme Corp", "amount": 1250.00, "date": "2026-01-15"}',
            outputLabel: 'Extracted Data (JSON)'
        },
        'sentiment': {
            input: 'I love this product!',
            output: 'Positive (0.94) - Joy, Satisfaction',
            outputLabel: 'Sentiment Analysis'
        },
        'voice': {
            input: 'Hello, welcome to SquidBay',
            output: '[Audio Generated: 3.2s MP3]',
            outputLabel: 'Voice Output'
        },
        'code-gen': {
            input: 'Create a function to sort an array',
            output: 'def quicksort(arr): ...',
            outputLabel: 'Generated Code'
        },
        'image-analyze': {
            input: 'photo.jpg',
            output: '{"objects": ["person", "laptop", "coffee"], "scene": "office"}',
            outputLabel: 'Analysis Result (JSON)'
        }
    };

    // --------------------------------------------------------------------------
    // Filter Skills
    // --------------------------------------------------------------------------
    
    function initFilters() {
        const chips = document.querySelectorAll('.chip[data-filter]');
        const searchInput = document.getElementById('skillSearch');
        const skillCards = document.querySelectorAll('.skill-card');
        
        if (!chips.length) return;
        
        // Chip filter
        chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                chips.forEach(function(c) { c.classList.remove('active'); });
                chip.classList.add('active');
                
                const filter = chip.dataset.filter;
                filterSkills(filter, searchInput ? searchInput.value : '');
            });
        });
        
        // Search filter
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const activeChip = document.querySelector('.chip.active');
                const filter = activeChip ? activeChip.dataset.filter : 'all';
                filterSkills(filter, searchInput.value);
            });
        }
    }
    
    function filterSkills(category, searchTerm) {
        const skillCards = document.querySelectorAll('.skill-card');
        const search = searchTerm.toLowerCase().trim();
        
        skillCards.forEach(function(card) {
            const cardCategory = card.dataset.category;
            const cardSkill = card.dataset.skill;
            const cardName = card.querySelector('.skill-name').textContent.toLowerCase();
            const cardDesc = card.querySelector('.skill-description').textContent.toLowerCase();
            
            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesSearch = !search || 
                cardName.includes(search) || 
                cardDesc.includes(search) ||
                cardSkill.includes(search);
            
            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // --------------------------------------------------------------------------
    // Live Stats Animation
    // --------------------------------------------------------------------------
    
    function initLiveStats() {
        // Simulate live data updates
        setInterval(function() {
            const transactions = document.getElementById('transactions24h');
            const satsFlowing = document.getElementById('satsFlowing');
            
            if (transactions) {
                const current = parseInt(transactions.textContent.replace(/,/g, ''));
                const newVal = current + Math.floor(Math.random() * 5);
                transactions.textContent = newVal.toLocaleString();
            }
            
            if (satsFlowing) {
                const values = ['4.2M', '4.3M', '4.1M', '4.4M', '4.2M'];
                const randomVal = values[Math.floor(Math.random() * values.length)];
                satsFlowing.textContent = '⚡ ' + randomVal;
            }
        }, 5000);
    }

    // --------------------------------------------------------------------------
    // Invoke Modal
    // --------------------------------------------------------------------------
    
    window.showInvokeModal = function(skill, agent, price) {
        const modal = document.getElementById('invokeModal');
        const content = document.getElementById('modalContent');
        
        if (!modal || !content) return;
        
        // Generate fake invoice string
        const invoiceId = 'lnbc' + price + 'n1p' + Math.random().toString(36).substr(2, 40);
        
        // Calculate USD equivalent (rough estimate: 1 sat = $0.0004)
        const usdAmount = (price * 0.0004).toFixed(2);
        
        // Build modal content - Step 1: Invoice
        content.innerHTML = '\
            <div class="modal-header">\
                <h3>⚡ Invoke ' + skill.replace('-', ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); }) + '</h3>\
                <p>Provider: ' + agent + '</p>\
            </div>\
            <div class="invoice-display">\
                <div class="invoice-amount">' + price.toLocaleString() + ' sats</div>\
                <div class="invoice-usd">≈ $' + usdAmount + ' USD</div>\
                <div class="qr-placeholder">\
                    <div class="qr-center-icon">\
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>\
                        </svg>\
                    </div>\
                </div>\
                <div class="invoice-string">' + invoiceId + '...</div>\
            </div>\
            <div class="modal-actions">\
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>\
                <button class="btn btn-primary" onclick="simulatePayment(\'' + skill + '\', ' + price + ')">\
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">\
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>\
                    </svg>\
                    Simulate Payment\
                </button>\
            </div>\
        ';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.simulatePayment = function(skill, price) {
        const content = document.getElementById('modalContent');
        
        // Step 2: Processing
        content.innerHTML = '\
            <div class="processing-animation">\
                <div class="spinner"></div>\
                <h3>Processing Payment...</h3>\
                <p>Waiting for Lightning confirmation</p>\
            </div>\
        ';
        
        // Simulate payment delay
        setTimeout(function() {
            content.innerHTML = '\
                <div class="processing-animation">\
                    <div class="spinner"></div>\
                    <h3>Payment Confirmed!</h3>\
                    <p>Executing skill...</p>\
                </div>\
            ';
            
            // Simulate skill execution
            setTimeout(function() {
                showSuccess(skill, price);
            }, 1500);
        }, 2000);
    };
    
    function showSuccess(skill, price) {
        const content = document.getElementById('modalContent');
        const result = skillResults[skill] || { output: 'Success!', outputLabel: 'Result' };
        
        // Step 3: Success
        content.innerHTML = '\
            <div class="success-animation">\
                <div class="success-icon-large">\
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">\
                        <polyline points="20 6 9 17 4 12"></polyline>\
                    </svg>\
                </div>\
                <h3>Skill Executed!</h3>\
                <p>' + price.toLocaleString() + ' sats paid • ~2.1s execution time</p>\
                <div class="result-box">\
                    <div class="result-label">' + result.outputLabel + '</div>\
                    <div class="result-value' + (skill === 'translate' ? ' japanese' : '') + '">' + result.output + '</div>\
                </div>\
            </div>\
            <div class="modal-actions">\
                <button class="btn btn-primary" onclick="closeModal()" style="width: 100%;">Done</button>\
            </div>\
        ';
    }
    
    window.closeModal = function() {
        const modal = document.getElementById('invokeModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // Close modal on overlay click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // --------------------------------------------------------------------------
    // Initialize
    // --------------------------------------------------------------------------
    
    function init() {
        initFilters();
        initLiveStats();
        
        console.log('🦑 SquidBay Marketplace initialized');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');

// eslint-disable-next-line max-len
const iconURI = 'data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20version%3D%221.1%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ctitle%3Epen-icon%3C%2Ftitle%3E%3Cpath%20d%3D%22m18.856%203.5079c-2.8134%200.073968-5.6394%200.19931-8.4179%200.65808-0.98006%200.31109-1.5087%201.4362-1.3483%202.4131-1.4539%200.22647-2.9269%200.42012-4.335%200.85896-1.0245%200.48274-1.3331%201.8195-0.9367%202.817%200.95204%204.2684%204.7266%207.7466%209.0733%208.298%200.39534%200.0029%200.71%200.21858%200.99738%200.4614%200.87788%200.59337%201.8418%201.0611%202.8545%201.3739-0.1804%201.1024-0.57129%202.1705-1.1464%203.1283-1.2352-0.06861-2.5702%200.2825-3.3792%201.2757-0.80576%200.90538-1.0073%202.1763-0.9066%203.3477v2.0458c-1.438-0.01872-2.8993%200.63653-3.6987%201.8588-0.66916%200.97085-1.0139%202.3179-0.47937%203.4211%200.48366%200.85326%201.5539%201.1318%202.4708%201.0034%207.2788-0.0087%2014.56%200.02376%2021.837-0.02542%201.2214-0.14458%201.9861-1.53%201.6613-2.6728-0.29414-2.0686-2.3293-3.7122-4.4088-3.574-0.0034-1.2892%200.09129-2.593-0.09619-3.8754-0.41986-1.8119-2.3485-3.0535-4.1706-2.786-0.57308-0.96694-0.97216-2.0385-1.1542-3.1484%201.2328-0.37582%202.3891-0.99097%203.409-1.7772%204.3188-0.38642%208.2218-3.6259%209.3736-7.8111%200.26533-0.89799%200.55174-2.0166-0.12302-2.8084-0.47316-0.61175-1.2544-0.80991-1.9845-0.89221-0.99623-0.2049-2.0007-0.36557-3.0037-0.53379%200.05692-0.87944-0.23831-1.9091-1.1176-2.2827-0.85466-0.38685-1.8223-0.28763-2.7296-0.44008-2.7379-0.2645-5.4904-0.37002-8.2408-0.33386zm-9.7281%207.3884c0.04627%200.49226%200.11749%200.98242%200.22592%201.4652-0.4286-0.46649-0.78756-0.99758-1.0692-1.5647%200.25247%200.02308%200.74777-0.27851%200.83386-0.02783%200.00286%200.04243%200.0063%200.08491%200.00945%200.12737zm22.21-0.17224c0.25396%200.05773%200.52227%200.03527%200.26216%200.33032-0.25942%200.47178-0.575%200.91185-0.93545%201.3115%200.12645-0.5624%200.20659-1.135%200.2427-1.7101%200.14353%200.02273%200.28706%200.04547%200.43059%200.06822z%22%20fill%3D%22%23515151%22%2F%3E%3Cpath%20d%3D%22m9.9972%206.0731v1.2727c-1.5353%200.21976-3.0541%200.48942-4.5552%200.80544-0.58372%200.1239-0.96589%200.68586-0.86621%201.2742%200.77079%204.5291%204.5238%207.9532%209.1045%208.3064%201.1852%200.96863%202.5773%201.6518%204.0687%201.9965-0.14183%201.6836-0.70991%203.3033-1.6509%204.7066h-1.0962c-1.5367%200-2.7812%201.246-2.7812%202.7812v3.8937h-1.1125c-1.8432%200-3.3374%201.4942-3.3374%203.3374%200%200.6141%200.49839%201.1125%201.1125%201.1125h22.25c0.61438%200%201.1124-0.49783%201.1124-1.1125%200-1.8432-1.4942-3.3374-3.3374-3.3374h-1.1125v-3.8937c0-1.5367-1.246-2.7812-2.7812-2.7812h-1.0962c-0.94055-1.4033-1.5082-3.0231-1.6494-4.7066%201.4915-0.34534%202.8836-1.0288%204.0687-1.998%204.5812-0.35262%208.335-3.7769%209.106-8.3064%200.098671-0.58825-0.28423-1.1497-0.86778-1.2727-1.5086-0.31843-3.0273-0.5873-4.5537-0.80544v-1.2741c-1.51e-4%20-0.56145-0.41878-1.0347-0.97598-1.1036-2.9981-0.37337-6.0165-0.56006-9.0378-0.5595-3.06%200-6.0756%200.19005-9.0377%200.5595-0.5567%200.069518-0.97441%200.54268-0.97458%201.1036zm0%203.8996c0%201.774%200.46251%203.4413%201.2712%204.886-2.0279-0.90927-3.5723-2.6393-4.2467-4.7569%200.98798-0.19173%201.98-0.36104%202.9755-0.50848zm20.025%200v-0.37954c0.99975%200.14856%201.9921%200.31731%202.9755%200.50848-0.67425%202.1177-2.2188%203.8478-4.2467%204.7569%200.83599-1.4925%201.2737-3.1752%201.2711-4.8859z%22%20clip-rule%3D%22evenodd%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%2F%3E%3Cpath%20d%3D%22m18.877%205.0234c-2.6766%200.058632-5.3328%200.2069-7.9789%200.58494-0.50053%200.29756-0.22912%200.96773-0.29527%201.4383-0.08381%200.2776%200.20493%200.87534-0.22644%200.85427-1.6627%200.25914-3.3356%200.49682-4.9687%200.9039-0.46425%200.3529-0.10684%200.97684-0.034243%201.4327%200.76252%202.8075%202.8702%205.1611%205.5731%206.2456%200.94313%200.3795%201.945%200.58073%202.9701%200.66408%201.2772%201.0866%202.8489%201.7804%204.4827%202.1228-0.10263%202.0592-0.78064%204.0886-1.9763%205.7722-0.99895%200.01403-2.1988-0.18081-2.9585%200.63214-0.65515%200.61875-0.68676%201.5782-0.63839%202.4169v3.6268c-1.1536%200.0311-2.4928-0.21956-3.4397%200.61138-0.67416%200.56097-1.1587%201.503-0.93898%202.3827%200.35791%200.43592%200.99829%200.17381%201.4808%200.24164%207.1108-0.0034%2014.223%200.01185%2021.333-0.0146%200.52589-0.17134%200.38836-0.83024%200.27382-1.2344-0.33687-1.2742-1.6816-2.1383-2.98-1.9889h-1.3649c-0.03625-1.6683%200.06949-3.3443-0.06112-5.0075-0.23304-1.0718-1.3614-1.7979-2.4331-1.6703-0.46074-0.0323-1.1305%200.17055-1.353-0.37268-1.0516-1.5992-1.6247-3.4891-1.7259-5.3954%201.6345-0.34575%203.2105-1.0363%204.486-2.1284%202.821-0.15055%205.4652-1.6263%207.1137-3.9116%200.8467-1.2059%201.4628-2.6118%201.6302-4.0818-0.17048-0.57267-0.9091-0.44266-1.3614-0.59693-1.3522-0.27157-2.6951-0.47965-4.063-0.68368-0.065104-0.68174%200.087206-1.3819-0.073819-2.0512-0.32594-0.41119-0.96454-0.25273-1.3945-0.36415-2.9996-0.33196-6.0373-0.46947-9.0774-0.42882zm10.889%203.9145c1.3431%200.21436%202.6884%200.43224%204.0241%200.69567-0.63758%202.4766-2.3608%204.6877-4.7134%205.7402-0.58982%200.28364-1.1795%200.56755-1.769%200.8518%200.99166-1.6967%201.9763-3.4993%202.078-5.5067%200.0418-0.61132%200.02794-1.2046%200.028-1.837%200.11744%200.018668%200.23487%200.037279%200.35231%200.055947zm-19.163%200.30086c-0.09481%201.9417%200.33406%203.9162%201.3369%205.5906%200.14816%200.27918%200.50648%200.72317%200.1113%200.94974-0.34397%200.12249-0.6575-0.25722-0.99157-0.33543-2.0123-0.92485-3.6799-2.6125-4.4515-4.7021-0.14869-0.36263-0.26074-0.73897-0.38599-1.1102%201.4573-0.26789%202.9149-0.53146%204.3809-0.74599v0.35342z%22%20fill%3D%22%23f5c887%22%2F%3E%3C%2Fsvg%3E';

class CustomAchievements {
    constructor (runtime) {
        this.runtime = runtime;

        this._cache = {};
        this._projectId = null;
        this._fetchPromise = null;
        this._popupCloseResolve = null;

        this._overriddenAchievements = new Set();

        this._API_HOST = this.runtime.additionalInfo.API_HOST;
        this._API_BASE = `${this._API_HOST}/v1/`;
        this._TRUSTED_IFRAME_HOST = this.runtime.additionalInfo.TRUSTED_IFRAME_HOST;
        this._projectId = this.runtime.additionalInfo.projectId;
        this._accessToken = this.runtime.additionalInfo.authToken;
        this._customAchievements = this.runtime.additionalInfo.customAchievements;
        this._sendToUI('ACHIEVEMENTS_UPDATED', {achievementData: this._customAchievements});
        // basically says if your in editor or not
        this._canRecieveAchievement = this.runtime.additionalInfo.canRecieveAchievement;
        this._canSave = this.runtime.additionalInfo.canSave;
        
        if (this._customAchievements && Array.isArray(this._customAchievements)) {
            // Load from provided data without fetching
            this._updateCacheFromData(this._customAchievements);
        } else {
            // No data provided, fetch immediately
            this._fetchData();
        }

        // Poll every minute (60000ms) to sync with server
        // Logic: Only poll if we have a valid user (not anonymous) AND we are not in editor/creator mode
        if (this._accessToken !== 'anonymous' && this._canRecieveAchievement) {
            this._pollInterval = setInterval(() => {
                this._fetchData();
            }, 60000);
        } else {
            console.log('skipping achievement polling');
        }


        window.addEventListener('message', event => {
            if (event.origin !== this._TRUSTED_IFRAME_HOST) {
                console.warn('Ignored message from untrusted origin:', event.origin);
                return;
            }

            const data = event.data;
            if (data?.type === 'block-compiler-action') {
                if (data.action === 'ACHIEVEMENT MODIFIED') {
                    if (data.achievementData && Array.isArray(data.achievementData)) {
                        this._updateCacheFromData(data.achievementData);
                    }
                } else if (data.action === 'POPUP_CLOSED') {
                    this.runtime.startHats('customAchievements_whenLeaderboardClosed');
                    if (this._popupCloseResolve) {
                        this._popupCloseResolve();
                        this._popupCloseResolve = null;
                    }
                } else if (data.action === 'ACHIEVEMENT_RENAMED') {
                    this._renameAchievement(data.oldName, data.newName);
                }
            }
        });

    }

    /**
     * Updates the internal cache from an array of achievement objects
     * @param {Array} data Array of achievement objects from API or preload
     */
    _updateCacheFromData (data) {
        let newUnlockCount = 0;
        const totalCount = data.length;
        const newlyUnlocked = [];

        const oldCache = this._cache;
        this._cache = {};

        data.forEach(ach => {
            const oldData = oldCache[ach.name];
            const wasUnlocked = oldData && oldData.unlocked;
            let isUnlocked = ach.unlocked || false;

            // In editor mode, assume everything is locked initially to allow testing
            if (!this._canRecieveAchievement) {
                isUnlocked = false;
            }

            if (this._overriddenAchievements.has(ach.name)) {
                isUnlocked = true;
                if (!ach.unlocked_at) {
                    ach.unlocked_at = oldData ? oldData.unlockedAt : new Date().toISOString();
                }
            }

            this._cache[ach.name] = {
                id: ach.id,
                unlocked: isUnlocked,
                description: ach.description || '',
                rarity: ach.rarity || 0,
                unlockedAt: ach.unlocked_at || null
            };

            if (isUnlocked) newUnlockCount++;
            if (!wasUnlocked && isUnlocked) {
                newlyUnlocked.push(ach.name);
            }
        });

        // Refresh blocks to update the menu if manager is available
        if (this.runtime.extensionManager) {
            this.runtime.extensionManager.refreshBlocks();
        }

        newlyUnlocked.forEach(name => {
            this.runtime.startHats('customAchievements_whenAchievementUnlocked', {
                ACHIEVEMENT: 'any'
            });
            this.runtime.startHats('customAchievements_whenAchievementUnlocked', {
                ACHIEVEMENT: name
            });
        });

        if (totalCount > 0 && newUnlockCount === totalCount) {
            const oldTotalUnlocked = Object.values(oldCache).filter(a => a.unlocked).length;
            const oldTotalCount = Object.keys(oldCache).length;
            const wasComplete = oldTotalCount > 0 && oldTotalUnlocked === oldTotalCount;
            
            if (!wasComplete) {
                this.runtime.startHats('customAchievements_whenAllAchievementsCompleted');
            }
        }
    }

    /**
     * Renames an achievement in the cache and updates all blocks referencing it.
     * @param {string} oldName The previous name of the achievement
     * @param {string} newName The new name of the achievement
     */
    _renameAchievement (oldName, newName) {
        if (!oldName || !newName || oldName === newName) return;

        // 1. Update internal cache
        if (Object.prototype.hasOwnProperty.call(this._cache, oldName)) {
            this._cache[newName] = this._cache[oldName];
            delete this._cache[oldName];
        }

        // 2. Update overridden set
        if (this._overriddenAchievements.has(oldName)) {
            this._overriddenAchievements.delete(oldName);
            this._overriddenAchievements.add(newName);
        }

        // 3. Update blocks in the runtime
        const targets = this.runtime.targets;
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const blocks = target.blocks;
            
            for (const blockId in blocks._blocks) {
                if (!Object.prototype.hasOwnProperty.call(blocks._blocks, blockId)) continue;
                const block = blocks._blocks[blockId];

                // Check if this is a custom achievements block
                if (block.opcode.startsWith('customAchievements_')) {
                    // Check inputs (for menu arguments)
                    if (block.inputs.ACHIEVEMENT) {
                        const input = block.inputs.ACHIEVEMENT;
                        // Usually extension menus are shadow blocks connected to the input
                        const shadowBlockId = input.shadow;
                        if (shadowBlockId) {
                            const shadowBlock = blocks.getBlock(shadowBlockId);
                            if (shadowBlock && shadowBlock.fields) {
                                for (const fieldName in shadowBlock.fields) {
                                    if (shadowBlock.fields[fieldName].value === oldName) {
                                        shadowBlock.fields[fieldName].value = newName;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 4. Refresh UI to show new name in dropdowns and blocks
        if (this.runtime.extensionManager) {
            this.runtime.extensionManager.refreshBlocks();
        }
        this.runtime.requestBlocksUpdate();
    }

    /**
     * Fetches achievement data from the API.
     * @returns {Promise<void>}
     */
    _fetchData () {
        const projectId = this._projectId;
        if (!projectId) {
            // Don't try to fetch if we don't know where to fetch from
            return Promise.resolve();
        }

        // If we are already fetching, return the existing promise to prevent race conditions
        if (this._fetchPromise) return this._fetchPromise;

        const url = `${this._API_BASE}projects/custom/${projectId}/achievements`;
        
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this._accessToken) {
            headers.Authorization = `Bearer ${this._accessToken}`;
        }

        this._fetchPromise = fetch(url, {
            method: 'GET',
            headers: headers
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                this._updateCacheFromData(data);
            })
            .then(data => {
                this._sendToUI('ACHIEVEMENTS_UPDATED', {achievementData: data});
            })
            .catch(err => {
                console.warn('Failed to fetch custom achievements:', err);
            })
            .finally(() => {
                this._fetchPromise = null;
            });

        return this._fetchPromise;
    }

    getInfo () {
        return {
            id: 'customAchievements',
            name: formatMessage({
                id: 'customAchievements.categoryName',
                default: 'Achievements',
                description: 'Label for the Achievements extension category'
            }),
            color1: '#FFB700',
            color2: '#E6A500',
            color3: '#CC9200',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'unlockAchievement',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'customAchievements.unlockAchievement',
                        default: 'unlock achievement [ACHIEVEMENT]',
                        description: 'Unlock an achievement'
                    }),
                    arguments: {
                        ACHIEVEMENT: {
                            type: ArgumentType.STRING,
                            menu: 'achievementsMenu'
                        }
                    }
                },
                {
                    opcode: 'isUnlocked',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'customAchievements.isUnlocked',
                        default: 'is achievement [ACHIEVEMENT] unlocked?',
                        description: 'Check if an achievement is unlocked'
                    }),
                    arguments: {
                        ACHIEVEMENT: {
                            type: ArgumentType.STRING,
                            menu: 'achievementsMenu'
                        }
                    }
                },
                {
                    opcode: 'openAchievementPopup',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'customAchievements.openAchievementPopup',
                        default: 'open achievement popup and [PAUSE_OPTION]',
                        description: 'Open the achievements popup'
                    }),
                    arguments: {
                        PAUSE_OPTION: {
                            type: ArgumentType.STRING,
                            menu: 'pauseOptions',
                            defaultValue: 'pause'
                        }
                    }
                },
                {
                    /* THIS IS OPCODE IS COMPLETELY INCORRECT AND MAKES NO SENSE,
                    however due to the fact that existing projects use this inccorect code we cant't change it
                    this block is ONLY used ACHIEVEMENT popup is closed
                    */
                    opcode: 'whenLeaderboardClosed',
                    blockType: BlockType.EVENT,
                    isEdgeActivated: false,
                    text: formatMessage({
                        id: 'customAchievements.whenAchievementClosed',
                        default: 'when achievement popup closed',
                        description: 'Event triggered when the achievement popup is closed'
                    })
                },
                '---',
                {
                    opcode: 'getUnlockedCount',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'customAchievements.getUnlockedCount',
                        default: 'number of unlocked achievements',
                        description: 'Returns the count of unlocked achievements'
                    }),
                    disableMonitor: true
                },
                {
                    opcode: 'getTotalCount',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'customAchievements.getTotalCount',
                        default: 'number of total achievements',
                        description: 'Returns the total count of achievements'
                    }),
                    disableMonitor: true
                },
                {
                    opcode: 'getAchievementData',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'customAchievements.getAchievementData',
                        default: '[DATA_TYPE] of [ACHIEVEMENT]',
                        description: 'Get specific data about an achievement'
                    }),
                    arguments: {
                        DATA_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'achievementDataMenu',
                            defaultValue: 'description'
                        },
                        ACHIEVEMENT: {
                            type: ArgumentType.STRING,
                            menu: 'achievementsMenu'
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenAchievementUnlocked',
                    blockType: BlockType.EVENT,
                    isEdgeActivated: false,
                    text: formatMessage({
                        id: 'customAchievements.whenAchievementUnlocked',
                        default: 'when achievement [ACHIEVEMENT] unlocked',
                        description: 'Triggers when a specific achievement is unlocked'
                    }),
                    arguments: {
                        ACHIEVEMENT: {
                            type: ArgumentType.STRING,
                            menu: 'achievementsMenuWithAny',
                            defaultValue: 'any'
                        }
                    }
                },
                {
                    opcode: 'whenAllAchievementsCompleted',
                    blockType: BlockType.EVENT,
                    isEdgeActivated: false,
                    text: formatMessage({
                        id: 'customAchievements.whenAllAchievementsCompleted',
                        default: 'when all achievements completed',
                        description: 'Triggers when 100% of achievements are unlocked'
                    })
                }
            ],
            menus: {
                achievementsMenu: {
                    acceptReporters: true,
                    items: 'getAchievementsMenu'
                },
                achievementsMenuWithAny: {
                    acceptReporters: false,
                    items: 'getAchievementsMenuWithAny'
                },
                pauseOptions: {
                    acceptReporters: true,
                    items: [
                        {
                            text: formatMessage({
                                id: 'customAchievements.pause',
                                default: 'pause',
                                description: 'Pause the project execution'
                            }),
                            value: 'pause'
                        },
                        {
                            text: formatMessage({
                                id: 'customAchievements.dontPause',
                                default: "don't pause",
                                description: 'Do not pause the project execution'
                            }),
                            value: 'no_pause'
                        }
                    ]
                },
                achievementDataMenu: {
                    items: [
                        {
                            text: formatMessage({
                                id: 'customAchievements.data.dateUnlocked',
                                default: 'date unlocked',
                                description: 'Date the achievement was unlocked'
                            }),
                            value: 'date unlocked'
                        },
                        {
                            text: formatMessage({
                                id: 'customAchievements.data.description',
                                default: 'description',
                                description: 'Description of the achievement'
                            }),
                            value: 'description'
                        },
                        {
                            text: formatMessage({
                                id: 'customAchievements.data.rarity',
                                default: 'rarity',
                                description: 'Rarity of the achievement'
                            }),
                            value: 'rarity'
                        }
                    ]
                }
            }
        };
    }

    getAchievementsMenu () {
        const projectId = this._projectId;
        if (!projectId) {
            return [
                {text: 'Error: No Project ID', value: 'error'}
            ];
        }

        if (Object.keys(this._cache).length === 0) {
            this._fetchData();
            return [
                {text: '', value: ''}
            ];
        }

        // Map keys (names) to menu items
        const items = Object.keys(this._cache).map(name => ({
            text: name,
            value: name
        }));

        if (items.length === 0) {
            return [
                {text: 'No achievements found', value: ''}
            ];
        }

        return items;
    }

    getAchievementsMenuWithAny () {
        const items = this.getAchievementsMenu();
        if (items.length > 0 && items[0].value !== '' && items[0].value !== 'error') {
            items.unshift({
                text: formatMessage({
                    id: 'customAchievements.any',
                    default: 'any',
                    description: 'Any achievement'
                }),
                value: 'any'
            });
        }
        return items;
    }

    /**
     * Helper to send messages to the UI via postMessage.
     * @param {string} action The action type.
     * @param {object} payload The data to send.
     */
    _sendToUI (action, payload = {}) {
        window.parent.postMessage({
            type: 'block-compiler-action',
            action: action,
            ...payload
        }, this._TRUSTED_IFRAME_HOST || '*');
    }

    openAchievementPopup (args) {
        this._sendToUI('OPEN_ACHIEVEMENT_POPUP');

        if (args.PAUSE_OPTION === 'pause') {
            return new Promise(resolve => {
                this._popupCloseResolve = resolve;
            });
        }
    }

    async unlockAchievement (args) {
        const achievementName = Cast.toString(args.ACHIEVEMENT);
        const projectId = this._projectId;

        if (!projectId || !achievementName) return;

        // Look up ID by name
        const achievementData = this._cache[achievementName];
        if (!achievementData) {
            console.warn(`Achievement "${achievementName}" not found in this project.`);
            return;
        }

        const wasUnlocked = this._cache[achievementName].unlocked;

        if (!this._canRecieveAchievement) {
            // eslint-disable-next-line no-negated-condition
            if (!this._canSave) {
                // "To prevent abuse you cannot recieve achievement once going in editor"
                this._sendToUI('ACHIEVEMENT_ERROR', {
                    reason: 'editor_abuse',
                    achievementName
                });
            } else {
                // "You must be on main project page to recieve award, but you attempted to grant your self..."
                this._sendToUI('ACHIEVEMENT_ERROR', {
                    reason: 'creator_mode',
                    achievementName
                });
            }

            if (!wasUnlocked) {
                this._overriddenAchievements.add(achievementName);
                this._cache[achievementName].unlocked = true;
                this._cache[achievementName].unlockedAt = new Date().toISOString();

                this.runtime.startHats('customAchievements_whenAchievementUnlocked', {
                    ACHIEVEMENT: 'any'
                });
                this.runtime.startHats('customAchievements_whenAchievementUnlocked', {
                    ACHIEVEMENT: achievementName
                });
                const totalUnlocked = Object.values(this._cache).filter(a => a.unlocked).length;
                const totalCount = Object.keys(this._cache).length;
                if (totalCount > 0 && totalUnlocked === totalCount) {
                    this.runtime.startHats('customAchievements_whenAllAchievementsCompleted');
                }
            }
            return;
        }

        const achievementId = achievementData.id;

        try {
            const url = `${this._API_BASE}projects/custom/${projectId}/achievements/${achievementId}/unlock`;
            
            const headers = {
                'Content-Type': 'application/json'
            };

            if (this._accessToken && this._accessToken !== 'anonymous') {
                headers.Authorization = `Bearer ${this._accessToken}`;
            } else {
                this._sendToUI('ACHIEVEMENT_UNLOCKED', {
                    achievementName
                });
                return;
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: headers
            });

            if (res.ok) {
                const now = new Date().toISOString();
                if (this._cache[achievementName]) {
                    this._cache[achievementName].unlocked = true;
                    this._cache[achievementName].unlockedAt = now;

                    if (!wasUnlocked) {
                        this.runtime.startHats('customAchievements_whenAchievementUnlocked', {
                            ACHIEVEMENT: 'any'
                        });
                        this.runtime.startHats('customAchievements_whenAchievementUnlocked', {
                            ACHIEVEMENT: achievementName
                        });

                        const totalUnlocked = Object.values(this._cache).filter(a => a.unlocked).length;
                        const totalCount = Object.keys(this._cache).length;
                        if (totalCount > 0 && totalUnlocked === totalCount) {
                            this.runtime.startHats('customAchievements_whenAllAchievementsCompleted');
                        }
                    }
                } else {
                    // If it wasn't in cache (e.g. added while project running), refresh
                    this._fetchData();
                }
                
                this._sendToUI('ACHIEVEMENT_UNLOCKED', {
                    achievementName
                });

            } else {
                console.warn(`Failed to unlock achievement ${achievementName}: ${res.status}`);
            }
        } catch (e) {
            console.error('Error unlocking achievement:', e);
        }
    }

    isUnlocked (args) {
        const achievementName = Cast.toString(args.ACHIEVEMENT);
        if (this._cache[achievementName]) {
            return this._cache[achievementName].unlocked;
        }
        return false;
    }

    getUnlockedCount () {
        return Object.values(this._cache).filter(a => a.unlocked).length;
    }

    getTotalCount () {
        return Object.keys(this._cache).length;
    }

    getAchievementData (args) {
        const achievementName = Cast.toString(args.ACHIEVEMENT);
        const type = args.DATA_TYPE;
        const data = this._cache[achievementName];

        if (!data) return '';

        if (type === 'date unlocked') {
            if (!data.unlocked || !data.unlockedAt) return '';
            const date = new Date(data.unlockedAt);
            if (isNaN(date.getTime())) return '';
            // XX/XX/XXXX format (MM/DD/YYYY)
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date
                .getDate()
                .toString()
                .padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        } else if (type === 'description') {
            return data.description || '';
        } else if (type === 'rarity') {
            return data.rarity || 0;
        }
        return '';
    }

    whenAchievementUnlocked () {
        return false;
    }

    whenAllAchievementsCompleted () {
        return false;
    }
}

module.exports = CustomAchievements;

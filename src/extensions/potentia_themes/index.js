const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

// eslint-disable-next-line max-len
const iconURI = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MTAuODg5MTEiIGhlaWdodD0iNjI5LjA5Nzc3IiB2aWV3Qm94PSIwLDAsNTEwLjg4OTExLDYyOS4wOTc3NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIzMjAiIHkxPSItMTI0LjczMTk1IiB4Mj0iMzIwIiB5Mj0iNDg0LjczMTkzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEiPjxzdG9wIG9mZnNldD0iMC4wMyIgc3RvcC1jb2xvcj0iI2Y1MDA5YiIvPjxzdG9wIG9mZnNldD0iMC41MTY1MSIgc3RvcC1jb2xvcj0iIzU5MDBmZiIvPjxzdG9wIG9mZnNldD0iMC45NzY0MiIgc3RvcC1jb2xvcj0iIzAwOTFmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NC40MDU5MiwxMzQuMzY1ODQpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik01NjQuOTUxMTIsNjkuNzIxODhjLTAuMjI5ODEsMi4yMjM0MyAtMC41MzcwNyw0LjM3MDQzIC0wLjkyMDYsNi41MTgxOWMtMTAuMTk5MDksNTMuNDQ4MzYgLTM4LjI2NDczLDk2LjA4NDcyIC04MS4yMDc5LDEyMy40NjA0MmMtMjUuODQyMjQsMTYuNTYzMjYgLTU5Ljk2Njk1LDI4LjI5NjcgLTEwMy45ODMyLDM1LjY1OGMtMC4xNTM1MywwLjA3NjE4IC0wLjMwNjY0LDAuMDc2MTggLTAuNDU5NzIsMC4wNzYxOGMwLjIyOTgxLDcuNTE0OTIgMC40NTk3MiwxNS44NzM1NyAwLjYxMzI1LDI0Ljk5ODA0YzQzLjAxOTMsMS42MTAwNCA2Ny43MTE3OCwyMy44NDg4NyA3OS40NDQyNCwzOC40MTgzYzEwLjY1ODgxLDEzLjExMzE2IDIyLjc3NDY0LDM0Ljk2NzkxIDIyLjc3NDY0LDY2LjQ4NDU5YzAsNTAuNTM0MjcgLTMyLjY2NzY0LDkxLjc4OTk3IC04MS4yODQ2OCwxMDIuNjAyOTZjLTE4Ljk0MTIyLDQuMjE4MDYgLTM5LjU2ODc2LDUuMjE0MTYgLTYxLjM0NjgyLDIuODM2NDloLTAuNDU5NjdjLTEuMzAzODgsMCAtMy44MzQwMiwwLjA3NjE4IC04LjEyODM0LDAuNTM2NDFjLTIyLjU0NDg0LDIuNTMwNjQgLTI5LjUyMjgsMy4xNDM4OSAtMzMuOTcxMTIsMy4yOTc0NmMtMy45MTA4MiwwLjIyOTgxIC0xNC4wMzMxMSwxLjE0OTkyIC0zNy4wMzc4Myw0LjUyNDcyYy0yNi40NTYxNSwzLjkxMDgyIC00NC4yNDY0NSw1LjU5ODI5IC01Ny43NDI2MSw1LjU5ODI5Yy0zNC4yMDA5NSwwIC02Mi41NzQ0OCwtOS4xMjU2MSAtODQuNDI4NjcsLTI3LjIyMjU2Yy0zNi44ODUwNCwtMjkuNzUyNTUgLTQ2LjYyNDAyLC03OC43NTQxOSAtMjQuMTU1NDcsLTExOS4zMTk3YzE1LjY0MzIsLTI5LjkwNzI0IDM3LjgwNDU2LC00My43ODYyMiA1NC45MDUyNywtNTAuMjI3NjNjNy4zNjE5LC0yLjkxMzk4IDE1LjMzNjU2LC01LjIxNDE2IDIzLjc3MjA4LC02Ljk3Nzkxdi0wLjA3NjE4Yy0yLjIyMzQzLC0xMi43Mjk2OCAtMi45OTAyMiwtMjcuODM2NDMgLTIuNTMwNywtNDcuOTI3NXYtMzEuOTc3NTVjLTEuNDU3MDcsLTYuMDU3OTYgLTIuNjg0MTcsLTEzLjExMzE2IC0yLjY4NDE3LC0yMS40NzEyN3YtNDIuMTc1NTljLTAuMTUzNTMsLTEuOTk0MTcgLTAuMzA3MTUsLTQuMDYzODQgLTAuMzgzNDUsLTYuMTM0MjVjLTAuMzA3MTUsLTUuNTIwODYgLTAuNjkwMTQsLTEzLjg4MDA5IC0xLjE0OTkyLC0yNC45MjI0Yy0wLjE1MzUzLC01LjIxNDE2IC0wLjM4MzM5LC0xMS4wNDIzMSAtMC42OTA2OSwtMTcuNDA3NDZjLTI2LjM3OTQ1LC00Ljc1NDU4IC00OS45MjEwNCwtMTcuODY3NzQgLTY3Ljc4ODEzLC0zOC4xMTE4Yy0xMC44MTI0MywtMTIuMjY4OTEgLTE3Ljg2NzY5LC0yNy41MjkxNyAtMjAuMTY3ODcsLTQzLjc4NjIyYy0xLjA3MzUzLC03LjA1NTI2IC0xLjUzMzE1LC0xNC4wMzMxMSAtMS41MzMxNSwtMjAuNzA0MzhjMCwtMjguOTA5OTUgMTIuNDIzMDcsLTU1LjkwMjE2IDM0LjEyMzY1LC03NC4wNzY5MWMwLjkyLC0wLjc2NjMzIDEuNzY0MjYsLTEuNDU2NTYgMi42ODQxNywtMi4xNDcxNmMyMy4xNTgxNCwtMTcuODY3NjkgNTIuMzc0NjgsLTI4LjE0MzYyIDg5LjI1OTk0LC0zMS40NDA1NGMwLjkyLC0wLjA3NjI0IDEuODQwNDQsLTAuMTUzMDggMi42ODQyMSwtMC4yMjk4MWw0OC4wMDM3NCwtMi42ODQ3N2MxLjUzMzE1LC0wLjA3NjI0IDMuMTQzODksLTAuMDc2MTggNC42NzcxOCwtMC4wNzYxOGg0OC40NjQ1MWMxNC45NTM3MSwtMC41MzY0NyAyNi44Mzg2MywtMC40NTk3MiAzNy4xOTEzMSwwLjA3NjE4YzAuODQzNzEsMC4wNzYyNCAxLjc2MzY2LDAuMTUzNTMgMi42MDY4OCwwLjIyOTgxYzI1LjYxMjU0LDIuMjIzNDMgNTYuNDM5MTcsOC4wNTE5MyA5NC4yNDQzMywxNy44Njc2OWMxLjkxNjY1LDAuNTM2NDcgMy45MTA4MiwxLjE1MDMyIDUuODI4MSwxLjc2MzY2YzYuNzQ3OTksMi4zMDA4NCAxMS44MDk3Myw0LjY3ODQgMzEuNTE2NzcsMTQuODc2ODRjMTUuNzE5OTUsNy45NzQ2NiAzMC44MjY2OCwxOS4wOTM3IDQ0Ljg1OTksMzMuMDUwMDhjMjMuMTU4MTQsMjIuMzE1MDEgMzYuOTYxMzQsNDcuMjM2ODEgNDEuMjU1NjQsNzQuMTUyN2MwLDAuMzgyNzkgMC4wNzYyNCwwLjc2NjkzIDAuMTUzMTMsMS4yMjcxYzMuNjA0MDEsMjUuMjI4OTkgNC4zNzA5OSwzOC41NzE5NyAyLjk5MDE2LDUwLjg0MTUzeiIgZmlsbD0idXJsKCNjb2xvci0xKSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIwIi8+PHBhdGggZD0iTTQ4MS4xNTExNCw2MC40NTA3OWMtNS44MjgwNSwzMC41ODE1MyAtMjAuMzk3NjQsNTMuMjg3NjIgLTQzLjY4NTg5LDY4LjEyNjA1Yy0xNi4xMzQzNiwxMC4zNTI3NyAtNDAuMzM2MiwxOC4yMTE2NCAtNzIuNTg5MjYsMjMuNjEwNjljLTM5LjQ0NjQ3LDYuNzQ3OTkgLTYzLjYzMjExLDExLjY5NDY1IC03Mi41ODkyNiwxNC44NDYxMXYzNS4wNjc3YzEuMzQxODgsMTQuNDAxODMgMi4yMzkxOCw0Mi4wNTMzNSAyLjY4NDIxLDgyLjk2MzkzYzAuNDQ1MzksMjcuNDI5OTggMi45MDYzNSw0OS42OTA1NiA3LjM3NjY1LDY2Ljc3NjQ1YzAuNDQ1MzksMC45MDQ1NyAzLjc5NjA4LDAuOTA0NTcgMTAuMDUzMTksMGM4LjQ4MSwtMC40NDUzOSAyMS40NDA1NywtMS41NzI3NSAzOC44NzA0NiwtMy4zNjcxOGMzLjU3Mjk5LC0wLjg5NzMgOC45MzM0NSwtMi4wMjQxOSAxNi4wODg3LC0zLjM3MzgxYzEyLjUwNjk5LC0xLjM0OTQ1IDIwLjk4ODU3LDAuOTA0NTcgMjUuNDU4OTYsNi43NDc5OWMyLjY3NjU0LDMuMTUxNjEgNC4wMTgzMyw3LjY1MzIyIDQuMDE4MzMsMTMuNDk2NTVjMCwxMS4yNTAxNiAtNS4wNTM0LDE3Ljk5IC0xNS4xNzU4MiwyMC4yMzY5OWMtMTAuMTE0MDMsMi4yNTQxNiAtMjEuNDg2NTksMi42OTkwMSAtMzQuMDYyNzEsMS4zNDg5MWMtNy4xOTI5MywtMC44ODk3MyAtMTYuNDI2MDcsLTAuNjc0NjUgLTI3LjY1MjA3LDAuNjc0NjVjLTE2LjE4NzM5LDEuODAyMDEgLTI1LjE4MjM5LDIuNjk5NTUgLTI2Ljk4NDQ0LDIuNjk5NTVjLTkuNDQwNDgsMC40NTk2NyAtMjQuODQ1NTEsMi4yNjI5MyAtNDYuMjAxNjQsNS4zOTkxMWMtMjEuMzU2NjQsMy4xMzYxNyAtMzYuNTQwMTUsNC43MjM4NiAtNDUuNTI3NTUsNC43MjM4NmMtMTQuNDAxODYsMCAtMjQuNzQ1MjEsLTIuNzUzMzggLTMxLjAzMzk5LC04LjIzNTc0Yy01LjM5MTQ0LC00LjExNzYxIC02LjUyNTkxLC04LjY5NTU3IC0zLjM2NjAzLC0xMy43MjU5OGMzLjEzNjE3LC02LjQxMDY4IDYuNzQ3OTksLTEwLjI5ODQzIDEwLjc4OTM5LC0xMS42NjM4OGM4Ljk5NTA5LC0zLjY2NTY3IDIxLjU3ODcyLC01LjQ5ODM0IDM3Ljc3NDMyLC01LjQ5ODM0YzExLjIzMzY3LDAgMjYuMDcyMTYsLTEuMzM0MTYgNDQuNTIyNDIsLTQuMDMzNjJjLTAuOTA0NTcsLTcuNjMwMDYgLTEuMTI3NCwtMTguODQwOTIgLTAuNjc0NzEsLTMzLjY2Mzg4YzAsLTMuNTgwNTEgLTAuNDU5NzIsLTguOTc5NjYgLTEuMzQ5NDUsLTE2LjE2NDk4YzAsLTAuNDQ1MzkgLTAuMzM3OTcsLTEuNTU3MzUgLTEuMDE5MjMsLTMuMzUxMmMtMC42NzQ3MSwtMS43OTQzIC0xLjAxMTU3LC0zLjE0Mzg5IC0xLjAxMTU3LC00LjA0OTA2YzAsLTE2LjYwOTg2IC0wLjIyOTgxLC0yNi43MDA3OSAtMC42NzQ2NSwtMzAuMjk3MjVjLTEuNzk0MywtNi4yODAwNyAtMi40Njk3NSwtMTguMTY2MDcgLTIuMDI0MTksLTM1LjY4MDU1YzAsLTI0LjY4NDg2IDAsLTM4LjM2NTI3IDAsLTQxLjA2NDI4YzAsLTIuNjk5NTUgLTAuNDUxOTUsLTUuNDk3ODUgLTEuMzQ5NDUsLTguNDE5NDljLTAuOTA0NTcsLTIuOTA2MzUgLTEuMzQ4OTEsLTQuNjAxIC0xLjM0ODkxLC01LjA0NjM5di00NS4xMTI3MmMwLDguMDkwMzggLTEuODAyMDUsLTM0Ljk5Nzk4IC01LjM5OTExLC0xMjkuMjU3NjFjMCwtMy4xMzYxNyAtMS4zNDk0NSwtNS42MDU4NyAtNC4wNDE0MywtNy40MDczN2MtNS44NTEwNSwwLjQ1MiAtMTQuOTUzNzEsMi4wMjQxNiAtMjcuMzE0NjksNC43MTYwOGMtMTIuMzY5MywyLjY5OTU1IC0yMS40NzkwMiw0LjA0MTQzIC0yNy4zMTQ3NSw0LjA0MTQzYy0xMS4yNTAxNiwwIC0yMC4yMzY5NCwtMy44MTA5NyAtMjYuOTg0NDQsLTExLjQ2MzY4Yy0wLjQ1MTk1LC0zLjEzNjE3IC0wLjY3NDcxLC02LjA2NTU5IC0wLjY3NDcxLC04Ljc3Mjc1YzAsLTQuMDQxNDMgMS4zNDg5MSwtNy4xODUyMSA0LjA0MDgzLC05LjQ0MDQ4YzkuODkyNTksLTcuNjM3ODMgMjQuOTYwMjUsLTEyLjM2MTUzIDQ1LjE5NzI0LC0xNC4xNjMyYzE1LjczNTI4LC0wLjg5NzMgMzEuNzA4ODQsLTEuNzg2NzIgNDcuODg5NjIsLTIuNjk5NTVjMi4yNDcwNCwwIDUuMzk3OTUsMCA5LjQzOTgzLDBjNC4wNDkwNiwwIDYuOTcwNzksMCA4Ljc3MjgsMGMzLjU5NywwIDE0LjE3MDgsMCAzMS43MDg4NCwwYzEyLjU4Mzc4LC0wLjQ1MiAyMi45MjgzNywtMC40NTIgMzEuMDI2ODcsMGMyMC42NzQyMSwxLjc5NDMgNDcuNDQzNTcsNi45NzA3NSA4MC4yNzE5NSwxNS41MDU0N2MxLjM0OTQ1LDAuNDU5NzIgOC4wOTA0MywzLjgyNjI2IDIwLjIzNjk0LDEwLjExNDA4YzguMDkwMzgsNC4wNDkwNiAxNi4xODczOSwxMC4xMTQ2OCAyNC4yNzgzNywxOC4yMTI2OWM5Ljg4NDMxLDkuNDQwNDggMTUuNTEzMTksMTguNDQyNiAxNi44NjI3MywyNi45ODQ0NGMyLjI0NzA0LDE1LjcyNzgxIDMuMTQzODQsMjUuNjIwMTUgMi42OTE4OSwyOS42NjA5M3pNNDQwLjY4NTQyLDUxLjI5NDU2Yy04LjEwNTIyLC0zOC40MDM1MiAtNTUuNzU2NywtNTcuODM0NzkgLTE0Mi45OTE4NCwtNTguMjk0NTZjLTIuMjU0MTYsMCAtNS42Mjg5MSwxLjM2NDI5IC0xMC4xMTQ2Myw0LjA2Mzc5YzAsNC41MjQ3MiAwLjY3NDY1LDIxLjI0MTM1IDIuMDI0MTYsNTAuMTU5MTZjMC40NDUzOSwxOC45ODY3NCAxLjU3MjEsNDcuNDUxOCAzLjM1ODQxLDg1LjQwMjgxYzAuODgyMTYsMCA3LjE1NDU0LC0wLjY3NDcxIDE4LjgwMzA0LC0yLjAzOTY4YzMuNTcyOTksMCA4LjQ4ODcyLC0wLjY3NTMxIDE0Ljc2MTY1LC0yLjAzMjUzYzIxLjQ5NDIyLC0zLjYxMTg0IDQzLjIwMzA1LC03LjQ1MzQ4IDY1LjE0Mjg2LC0xMS41MjU0NGMyNi40MDE4MSwtNi4zMTc5NSA0Mi4wNjkxOCwtMjAuNTUxMzUgNDYuOTk5NzgsLTQyLjY5NzM2YzIuNjkxODksLTkuNDg2MDUgMy4zNjYwMywtMTcuMTU0NSAyLjAxNjUzLC0yMy4wMzU4M3oiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvZz48L3N2Zz4=`;

/**
 * Class for TurboWarp blocks
 * @constructor
 */
class POTThemes {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'POTThemes',
            name: 'Check Themes',
            color1: '#FF52DF',
            color2: '#7F32E8',
            color3: '#2332D4',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                //From CattyMod LOL
				{
                    opcode: 'getColorTheme',
                    text: formatMessage({
                        id: 'tw.blocks.getColorTheme',
                        default: 'Get Color Theme',
                        description: 'Block that returns the current PotentiaMod color theme'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getGUITheme',
                    text: formatMessage({
                        id: 'tw.blocks.getGUITheme',
                        default: 'Get GUI Theme',
                        description: 'Block that returns the current PotentiaMod GUI theme'
                    }),
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {}
        };
    }
	
     getColorTheme () {
        const storedTheme = localStorage.getItem('tw:theme');

        // If tw:theme does not exist, default to Indigo.
        if (storedTheme === null) {
            return 'Indigo';
        }

        const theme = storedTheme.toLowerCase();

        if (theme.includes('red')) return 'Red';
        if (theme.includes('blue')) return 'Blue';
        if (theme.includes('indigo')) return 'Indigo';
        if (theme.includes('purple')) return 'Purple';
        if (theme.includes('orange')) return 'Orange';
        if (theme.includes('magenta')) return 'Magenta';
        if (theme.includes('green')) return 'Green';
        if (theme.includes('cyan')) return 'Cyan';
        if (theme.includes('lime')) return 'Lime';
        if (theme.includes('magenta-purple')) return 'Fuchsia';
        if (theme.includes('indigo-blue')) return 'SereneBlue';
        if (theme.includes('corrupted-blue')) return 'CorruptedBlue';
        if (theme.includes('gaia-blue')) return 'GaiaBlue';
        if (theme.includes('cottoncandy')) return 'CottonCandy';
        if (theme.includes('nitrofire')) return 'NitroFire';
        if (theme.includes('hotfuse')) return 'HotFuse';
        if (theme.includes('rainbow')) return 'Rainbow';

        // Unknown or missing color = Indigo.
        return 'Indigo';
    }

    getGUITheme () {
        const storedTheme = localStorage.getItem('tw:theme');

        // If tw:theme does not exist, use the system theme.
        if (storedTheme === null) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ?
                'Dark' :
                'Light';
        }

        const theme = storedTheme.toLowerCase();

        if (theme.includes('modern-dark')) return 'ModernDark';
        if (theme.includes('dark')) return 'Dark';
        if (theme.includes('midnight')) return 'Amoled';
        if (theme.includes('modern-light')) return 'ModernLight';
        if (theme.includes('light')) return 'Light';

        // If no GUI theme is specified, default to Light.
        return 'Dark';
    }
}

module.exports = POTThemes;
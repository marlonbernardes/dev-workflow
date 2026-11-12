vim.g.mapleader = " "
vim.opt.number = true
vim.opt.expandtab = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.smarttab = true
vim.opt.termguicolors = true
vim.opt.splitright = true
vim.opt.splitbelow = true
vim.opt.linebreak = true

vim.pack.add({
  { src = "https://github.com/catppuccin/nvim", name = "catppuccin" },
  "https://github.com/MeanderingProgrammer/render-markdown.nvim",
  "https://github.com/nvim-lua/plenary.nvim",
  "https://github.com/MunifTanjim/nui.nvim",
  {
    src = "https://github.com/nvim-neo-tree/neo-tree.nvim",
    version = "v3.x",
  },
  {
    src = "https://github.com/obsidian-nvim/obsidian.nvim",
    version = "v3.16.9",
  },
})

require("catppuccin").setup({
  flavour = "mocha",
})
vim.cmd.colorscheme("catppuccin-mocha")

require("neo-tree").setup({
  filesystem = {
    hijack_netrw_behavior = "open_current",
    follow_current_file = { enabled = true },
    filtered_items = {
      hide_dotfiles = false,
      hide_hidden = false,
    },
    window = {
      mappings = {
        ["h"] = {
          function(state)
            local hide = not state.filtered_items.hide_dotfiles
            state.filtered_items.hide_dotfiles = hide
            state.filtered_items.hide_hidden = hide
            require("neo-tree.sources.filesystem.commands").refresh(state)
          end,
          desc = "Toggle hidden files",
        },
      },
    },
  },
})

-- Neovim ships both Markdown parsers; no parser compiler is needed.
vim.api.nvim_create_autocmd("FileType", {
  pattern = "markdown",
  callback = function(event)
    vim.treesitter.start(event.buf)
  end,
})

require("render-markdown").setup({
  latex = { enabled = false },
})

require("obsidian").setup({
  legacy_commands = false,
  workspaces = {
    { name = "work", path = vim.env.NOTE_WORKSPACE or "~/work" },
  },
  frontmatter = { enabled = false },
  ui = { enable = false },
  footer = { enabled = false },
})

vim.keymap.set("n", "<leader>w", "<cmd>write<cr>")
vim.keymap.set("n", "<leader>q", "<cmd>quit<cr>")
vim.keymap.set("n", "<C-h>", "<C-w>h", { desc = "Focus left window" })
vim.keymap.set("n", "<C-j>", "<C-w>j", { desc = "Focus window below" })
vim.keymap.set("n", "<C-k>", "<C-w>k", { desc = "Focus window above" })
vim.keymap.set("n", "<C-l>", "<C-w>l", { desc = "Focus right window" })
vim.keymap.set("n", "<leader>e", "<cmd>Neotree toggle<cr>", {
  desc = "Toggle file tree",
})
vim.keymap.set("n", "<leader>m", "<cmd>RenderMarkdown toggle<cr>", {
  desc = "Toggle rendered Markdown",
})

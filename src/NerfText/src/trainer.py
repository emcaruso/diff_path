from data_collector import DataCollector
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from model import Model
from tqdm import tqdm


class Dataset:

    def __init__(self, cfg, data):
        self.cfg = cfg
        self.data = data

    def __getitem__(self, idx):
        x = self.data[idx, 0, :]
        y = self.data[idx, 1, :]
        return (x, y)

    def __len__(self):
        return self.data.shape[0]


class Trainer:

    def __init__(self, cfg):
        self.cfg = cfg
        self.dc = DataCollector(self.cfg)
        self.device = torch.device(self.cfg.train.device)

    def _get_data_loader(self, subfolder):
        data = self.dc.load_data(subfolder=subfolder)
        dataset = Dataset(self.cfg, data)
        data_loader = DataLoader(dataset, **self.cfg.train.data_loader_params)
        return data_loader

    def _save_model(self, model, epoch):

        model.epoch = epoch
        print("Saving model at epoch ", epoch)
        if epoch % self.cfg.train.save_every == 0:
            out_dir = Path(self.cfg.paths.save_data) / "model"
            out_dir.mkdir(exist_ok=True, parents=True)
            torch.save(
                model.state_dict(),
                str(out_dir / "last.pth"),
            )

    def load_model(self):
        model_path = Path(self.cfg.paths.save_data) / "model" / "last.pth"
        model = Model(self.cfg)
        model.load_state_dict(torch.load(str(model_path)))
        return model

    def _get_model(self):

        model_path = Path(self.cfg.paths.save_data) / "model" / "last.pth"
        if model_path.exists() and self.cfg.train.load:
            model = self.load_model()
            print("Model loaded")

        print("New model from scratch")
        return model

    def _eval_model(self, model, data_loader):
        model.eval()
        with torch.no_grad():
            loss_total = 0
            for x, y in data_loader:
                x, y = x.to(self.device), y.to(self.device)
                y_hat = model(x)
                loss = torch.nn.functional.mse_loss(y_hat, y)
                loss_total += loss.item()
        print("Eval loss: ", loss_total)
        model.train()

    def train(self):

        # initialize model and optimizer
        data_loader_train = self._get_data_loader("train")
        data_loader_eval = self._get_data_loader("eval")
        model = self._get_model()
        model.train()
        optimizer = torch.optim.Adam(model.parameters(), lr=self.cfg.train.lr)
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
            optimizer, T_max=self.cfg.train.epochs
        )

        progressbar = tqdm(range(self.cfg.train.epochs), desc="Training", leave=True)

        for epoch in progressbar:

            self._save_model(model, epoch)
            self._eval_model(model, data_loader_eval)

            loss_total = 0
            for x, y in tqdm(data_loader_train, leave=True):
                x, y = x.to(self.device, non_blocking=True), y.to(
                    self.device, non_blocking=True
                )

                y_hat = model(x)

                loss = torch.nn.functional.mse_loss(y_hat, y)
                loss.backward()

                loss_total += loss.item()

                optimizer.step()
                optimizer.zero_grad()

            progressbar.set_postfix({"loss": loss_total})
            scheduler.step()

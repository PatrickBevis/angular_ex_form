# Formulaire

- Un formulaire permet à l'utilisateur de communiquer avec les données de l'application
- **Angular** met également à disposition des outils pour gérer les formulaires via des directives
- Changement d'état, validation, groupes de formulaires , mise à jour des données, etc.

### **FONCTIONNEMENT GÉNÉRAL**

- Les formulaires fonctionnent avec des `controls`
- Les `controls` sont des éléments qui permettent de gérer les données
- Ils peuvent être liés avec des `<input>`
- Ils peuvent ensuite être groupés pour former à terme des objets

### FORMSMODULE

- C'est ce module qui nous permet de gérer les formulaires
- Il nous donne accès à tous les objets de gestion des formulaires
- Il permet la communication entre le code et le DOM

## **TEMPLATE DRIVEN FORMS**

- Est une façon de faire à éviter
- Elle semble plus facile à coder, mais sera bien plus difficile à maintenir

### Explication

- Consiste à déléguer la gestion du formulaire à notre template (html)
- Comme on le ferait sur un formulaire en html pur
- On utilisera ensuite des directives spécifiques Angular pour le gérer

---

### Exemple

- Nous allons créer un composant `ListeCourses`
- Ils servira à afficher une liste
- Il contiendra un `input` pour ajouter des articles à la liste

### Dans 📄`liste-course.component.ts`

```tsx
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-course',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './liste-course.component.html',
  styleUrl: './liste-course.component.css'
})
export class ListeCourseComponent {

  //Création d'une liste d'articles vides.
  articles: string[] = [];

  //Création  d'une variable pour stocker les nouveaux articles
  // en vue des les push dans notre tableau d'articles
  newArticle!: string;

  // Création d'une méthode permettant d'ajouter un nouvel article
  addArticle() {
    // Elle pousse l'article dans notre tableau
    this.articles.push(this.newArticle)
    // Puis vider notre varible newArticle pour que le champs soit vide
    this.newArticle = ''
  };

}

```

### Dans 📄`liste-course.component.html`

```tsx
<!-- Création d'un formulaire à la manière 'html' -->
<!-- Utilisation de la directive (ngSubmit) 
 qui est l'équivalent Angular de onSubmit -->
<form (ngSubmit)="addArticle()">
    <!-- Ajout d'un input, avec un two way binding sur newArticle -->
    <input type="text" name="newArticle" [(ngModel)]="newArticle">
    <!-- Boutton pour valider le formulaire -->
    <button type="submit">Ajouter</button> 
</form>
<ul>
    @for (article of articles; track $index) {
    <li>{{articles}}</li>
    }@empty {
        <p>Liste de courses vide!!!</p>
    }
</ul>
```

- Avec cette méthode, on est facilement capable de créer un petit formulaire
- Cependant, il est très difficile de le maintenir et à tester
- Il est préférable d'utiliser les **Reactive Forms**

---

## REACTIVE FORMS

- Les **Reactive Forms** permettent plus de contrôle sur les données du formulaire
- On pourra mettre en place des validations et autres
- Les différents éléments sont regroupés dans des `FormGroups` et des `FormsControls`

### FORMGROUP

- Chaque élément du formulaire est un `FormGroup`
- Il peut contenir 1 ou plusieurs `FormControls`
- C'est au final un moyen de regrouper les champs de notre formulaire et de créer des objets

### FORMCONTROL

- Désigne les différents champs de notre formulaire
- Il peut être de type `text, email, password, number, date, radio,` etc.
- Il peut être validé par un `validator`
- Constituera les attributs de notre objet

---

### Exemple

- Nous allons créer un nouveau composant **`ReactiveListeCourses`**
- Cette fois, on veut renseigner le nom de l'article et son prix
- On veut aussi voir afficher le prix total

### Dans 📄`reactive-liste-course.component.ts`

```tsx
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-liste-courses',
  standalone: true,
  // importation 
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-liste-courses.component.html',
  styleUrl: './reactive-liste-courses.component.css'
})
export class ReactiveListeCoursesComponent {

  // Définitons des variables

  //Article est déclaré en tant que FormGroup
  articleForm: FormGroup;

  // Articles est la liste d'articles, qui contiendra nos articles
  // Puisque nous n'avons pas de 'model', on le type en any popur le moment
  articles: any[] = []

  constructor() {
    // Dans le constructeur, on ajout le FormGroup qui contiendra nos FormControls
    this.articleForm = new FormGroup({
      // Article contiendra un attribut désignation et un attribut prix
      // C'est un peu comme si on déclarer un objet
      // Ajout des validateurs 'required' en 2nd paramètre
      designation: new FormControl('', Validators.required),
      prix: new FormControl(0, Validators.required)
    })
  }

  get prix(){
    return this.articleForm.controls['prix']
  }

  // On ajoute une méthode pour ajouter des articles
  // On l'ajoutera coté HTML avec l'événement submit
  addArticle() {
    //Ajout de l'article
    this.articles.push(this.articleForm.value);
    // Vide le formulaire
    this.articleForm.reset();
  }

  // Définition d'un getter pour pouvoir afficher le prix total
  get totalPrice(): number {
      // Utilisation de la méthode reduce pour calculer la somme des prix des articles
    return this.articles.reduce((total, article) => total + article.prix, 0)
  }
}

```

### Dans 📄`reactive-liste-course.component.html`

```tsx
<!-- Affiche tous les article au fur et à mesure -->

<form [formGroup]="articleForm" (ngSubmit)="addArticle()">
    <!-- On déclare nos formcontrols dans les input -->
    <label>
      Désignation:
      <input type="text" formControlName="designation">
    </label>
    <label>
      Prix:
      <input type="number" formControlName="prix">
      @if (prix.invalid && (prix.dirty || prix.touched)) {
        @if(prix.errors?.['required']){
          <small>
            <div>entrez un prix valide</div>
          </small>
        }      
      }
    </label>
    <!-- On oublie pas le bouton submit :) -->
    <!-- Modification du bouton submit qui sera désactivé si le formulaire n'est pas valide -->
    <button class="btn btn-primary" type="submit" [disabled]="!articleForm.valid">Ajouter</button>
  </form>

  <ul>
    @for (article of articles; track $index) {
        <li>{{article.designation}} : {{article.prix}} €</li>
    
    }
    </ul>
    
    <!-- Appel de notre getter pour afficher le  prix total-->
    <p>Total : {{totalPrice}} €</p>
    
```

- Nous avons bien une liste d'articles qui affiche les objets au fur et à mesure
- Nous avons pu générer des objets, et accéder à leurs attributs

### Conclusion

- Il faut préférer les `Reactive Forms` au `Template Driven Forms`
- Les `Reactive Forms` permettent de générer facilement des objets
- Objets qui seront facilement manipulables

---

## Les Validators

- Les **`validators`** permettent de valider les données du formulaire
- On peut définir des **validators** pour les **`formControls`**
- Ils permettent de vérifier que l'utilisateur entre bien des données valides/attendues

### Validators multiples

- On peut définir plusieurs `validators` pour un `formControl`
- On déclare les validateurs multiples dans un tableau

Avec `@if`

- Une fois le validator créé, on peut l’appliquer à notre template
- Voici quelques exemples de vérifications :

```tsx
NomFormControl.valid // Champs OK
NomFormControl.invalid // Champs pas OK
NomFormControl.pending // Validation en cours
NomFormControl.pristine // Champs non modifié
NomFormControl.dirty // Champs modifié par l'user
NomFormControl.untouched // Champs non 'touché'
NomFormControl.touched // Champs 'touché
```

<aside>
💡 [Pour en savoir plus](https://angular.dev/guide/forms/form-validation)

</aside>

### Cheminement

1. On a donc un formulaire avec des champs
2. On déclare les `validators` pour chaque champ
3. Dans notre HTML, on effectue une action en fonction du statut du champ

## FORMBUILDER

- `FormBuilder` est un outil qui facilite la création de formulaires
- Il gère lui-même les `FormControls` et `FormArrays` de sorte à ce que l'on n'ait pas besoin de les déclarer nous-mêmes.

---

### Exemple

- Nous allons créer un nouveau composant `FormbuilderListeCourses`
- Nous allons cette fois utiliser le `FormBuilder` pour gérer notre formulaire
- Nous en profiterons pour intégrer des validateurs sur chaque champ.

### Dans 📄`formBuilder-liste-cours.component.ts`

```tsx
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-builder-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-builder-list.component.html',
  styleUrl: './form-builder-list.component.css'
})
export class FormBuilderListComponent {
  // Déclaration du FormGroup
  // On rappelle la variable qu'on a déclaré dans le constructeur
  // On ajoute la méthode '.group()'
  article: FormGroup = this.formBuilder.group({
    // On déclare les champs les champs du formulaire
    // Pas besoin de générer de FormControl
    // On précise aussi les validators (si besoin)
    designation: ['', [Validators.required, Validators.minLength(3)]],
    prix: ['', Validators.required],
  })

  //Ajout d'un booleen pour vérifier que mon formulaire est soumis
  submitted: boolean = false;

  // Déclaration de la liste d'articles
  articles: any[] = []

  // Injection du formBuilder 
  formBuilder = inject(FormBuilder)
 

  // Déclaration d'une méthode pour ajouter les articles
  // Elle est privée car appelée par la méthode onSubmit
  private addArticle() {
    // Push du contenu du formulaire dans la liste
    this.articles.push(this.article.value);
    // Reset du formulaire
    this.article.reset()
    // On repasse submitted à false
    this.submitted = false;
  }

  //Méthode onSubmit pour gérer la soumission
  onSubmit(): boolean {
    this.submitted = true;
    // Appel du validateur 'invalid' pour lancer la vérification
    if (this.article.invalid) {
      return false;
    } else {
      // Si le formulaire est valide, on appelle la méthode addArticle()
      this.addArticle();
      return true;
    }
  }

  // Définition d'un getter pour pouvoir afficher le prix total
  get totalPrice(): number {
    return this.articles.reduce((total, article) => total + article.prix, 0);
  }

  // Pour se faciliter la vie on déclare un getter sur le form
  get designation() {
    // Il retournera notre formControl
    return this.article.controls['designation'];
  }
  get prix() {
    // Il retournera notre formControl
    return this.article.controls['prix'];
  }
}

```

### 

### Dans 📄`formbuilder-liste-course.component.html`

```tsx
<body>
    @for (article of articles; track $index) {
    <li>{{article.designation}} : {{article.prix}} €</li>

    }
    <p>Total : {{totalPrice}} €</p>

    <form [formGroup]="article" (ngSubmit)="onSubmit()">
        <div>
            <label>Désignation :</label>
            <input type="text" class="form-control" formControlName="designation">
            <!-- Ajout un @If pour afficher un message si le nom est invalide -->
            <!-- L'utilisateur a soit modifié le champ (prix.dirty) soit l'a touché (prix.touched). -->
            @if (designation.invalid && (designation.dirty || designation.touched)) 
            {
                @if (designation.errors?.['required']) {
                    <span>* Nom d'utilisateur requis :p</span> 
                }@else(){
                    <span>* Nom doit contenir plus de 2 lettres  :p</span> 
                }

            }
        </div>
        <div>
            <label>Prix :</label>
            <input type="number" class="form-control" formControlName="prix">
            <!-- Idem que pour nom, mais sur le prix -->
            @if (prix.invalid && (prix.dirty || prix.touched)) {
            <span>
                * Prix invalide 
            </span>
            }
        </div>
        
        <button class="btn btn-primary mt-3" [disabled]="article.invalid" type="submit">Ajouter</button>
    </form>
</body>
```

- Dans cet exemple, nous avons vu comment conditionner la validation du formulaire
- Nous avons vu comment gérer individuellement les champs

---

## FORMARRAYS

- Permet de créer un formulaire avec un nombre variable de champs
- L'utilisateur pourra choisir entre avoir un ou plusieurs champs de même type
- L'utilisateur pourra ajouter ou supprimer des champs lui-même

### Exemple

- Nous souhaitons donner la possibilité à l'utilisateur d'ajouter plusieurs numéros sur sa carte de visite
- Nous allons modifier notre dernier formulaire en conséquence

### Dans 📄`user-form.ts`

```tsx
export class UserFormComponent {

  // Déclaration du tableau utilisateurs, avec un utilisateur exemple.
  users: any[] = [
    {
      nom: 'Nareff',
      prenom: 'Paul',
      email: 'paul.nareff@gamil.com',
      telephone: '0123456789',
      entreprise: 'World Company',
    },
  ];

  // Déclaration du formulaire
  userForm: FormGroup = this.formBuilder.group({
    // Attribut nom avec un validateur 'required' et une longueur minimale de 2
    nom: ['', [Validators.minLength(2), Validators.required]],
    // Attribut prenom avec un validateur 'required' et une longueur minimale de 2
    prenom: ['', [Validators.minLength(2), Validators.required]],
    // Attribut email avec un validateur de type email
    email: ['', [Validators.email, Validators.required]],

    // Attribut telephone avec un validateur 'required' et une longueur minimale de 10
    // On déclare ici un tableau de FormArray
    // On y ajoute les controles pour le numéro de téléphone
    telephones: this.formBuilder.array([
      this.formBuilder.control('', [Validators.minLength(10), Validators.required])
    ]),

    // Attribut entreprise avec un validateur 'required' et une longueur minimale de 2
    entreprise: ['', [Validators.minLength(2), Validators.required]],
  })

  // Définition d'un bool avec une valeur par défaut à false
  // Servira à s'assurer de la soumussion du formulaire
  submitted: boolean = false;

  // Ajout du formulaire dans le constructeur
  constructor(private formBuilder: FormBuilder) { }

  // Méthode pour ajotuer un utilisateur
  // Elle est privée et sera appellée par la méthode onSubmit
  private addUser(): void {
    this.users.push(this.userForm.value);
    this.userForm.reset();
    this.submitted = false;
  }

  // Méthode onSubmit pour gérer la soumission du formulaire
  public onSubmit(): void {
    this.submitted = true
    if (this.userForm.valid) {
      this.addUser();
    }
  }

  // Getter pour accéder au controls du formulaire
  public get form() {
    return this.userForm.controls;
  }

  // Getter pour accéder à la liste des téléphones
  public get telephones(): FormArray {
    return this.userForm.get('telephones') as FormArray;
  }

  // Méthode pour ajouter un control dans de téléphone
  // la  méthode push un controle de téléphone dans le tableau 'téléphones'
  public addTelephone(): void {
    this.telephones.push(this.formBuilder.control('', [Validators.minLength(10), Validators.required]))
  }

  // Méthode pour supprimer un control de téléphone
  // On retire le dernier élément de l'index
  public removeTelephone(): void {
    this.telephones.removeAt(this.telephones.length - 1);
  }

```

### Dans 📄`user.form.html`

```tsx
@for (user of users; track $index) {
<div class="container">
  <div>
    <div>
      {{ user.entreprise }}

      <div>
        <div>
          {{ user.prenom }} {{ user.nom }}
        </div>
        <div>
          <p>email : {{ user.email }}</p>

          @for (telephone of user.telephones; track $index) {
          <p>Tel : {{ telephone.numero }}</p>
          }
        </div>
      </div>
    </div>
  </div>
</div>

}

<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <!-- Input Nom -->
    <label for="nom">Nom : </label>
    <input type="text" id="nom" formControlName="nom" placeholder="Nom" />
    <!-- Messages conditonnels à afficher Nom -->

    @if (submitted && form['nom'].invalid) {
    <span>
      @if (!form['nom'].value) {
      <span>
        * Nom obligatoire
      </span>
      }
      @if (form['nom'].hasError('minlength')) {
      <span>
        * Le Nom doit contenir au minimum 2 caratères
      </span>

      }
    </span>

    }
  </div>

  <!-- Input Prénom -->
  <div>
    <label for="prenom">Prénom : </label>
    <input type="text" id="prenom" formControlName="prenom" placeholder="Prenom" />
    <!-- Messages conditonnels à afficher Prenom -->
    @if (submitted && form['prenom'].invalid) {
    <span>
      @if (!form['prenom'].value) {
      <span>
        * Prénom obligatoire
      </span>

      }
      @if (form['prenom'].hasError('minlength')) {
      <span>
        * Le Prénom doit contenir au minimum 2 caratères
      </span>

      }
    </span>

    }
  </div>

  <!-- Input Email -->
  <div>
    <label for="email">Email : </label>
    <input type="email" id="email" formControlName="email" placeholder="Email" />
    <!-- Messages conditonnels à afficher Email -->
    @if (submitted && form['email'].invalid) {
    <span>
      @if (!form['email'].value) {
      <span>
        * Email obligatoire
      </span>

      }
      @if (form['email'].hasError('email')) {
      <span>
        * L'Email est invalide
      </span>

      }

    </span>

    }
  </div>

  <!-- Formulaire téléphone -->
  <!-- On déclare le FormArray -->
  <div formArrayName="telephones">
    <!-- On précise qu'on veut ajouter un champ de controle par téléphone -->
    @for (telephone of telephones.controls; track $index;) {
    <div [formGroupName]="$index">
      <label for="telephones">Telephone : </label>
      <!-- On utilise le property binding pour lier les champs et le téléphones -->
      <input type="tel" id="telephones" formControlName="numero" placeholder="Telephone" />
      <!-- On laisse les conditions  -->
      @if (submitted && form['telephones'].invalid) {
      <div>
        <span>
          * Telephone obligatoire
        </span>
        @if (telephone.get('numero')?.hasError('minlength')) {
        <span>
          * Le Telephone doit contenir au minimum 10 chiffres
        </span>
      }
    </div>
      }
    </div>
  }

    <!-- On ajoute à la fin les 2 butons qui vont chercher nos méthodes correspondantes -->
    <button type="button" (click)="addTelephone()">+</button>
    <!-- On fait attention à bien activer la suppression que si nécessaire ! -->
    @if (telephones.length > 1) {
    <button type="button" (click)="removeTelephone()">-</button>
    }
  </div>
  <div>
    <label for="entreprise">Entreprise : </label>
    <input type="text" id="entreprise" formControlName="entreprise" placeholder="Entreprise" />
    @if (submitted && form['entreprise'].invalid) {
    <span>
      @if (!form['entreprise'].value) {
      <span>
        * Entreprise obligatoire
      </span>
      @if (form['entreprise'].hasError('minlength')) {

      <span>
        * Le Entreprise doit contenir au minimum 2 caractères
      </span>
      }
    }
    </span>
    }
  </div>
  <div>
    <button type="submit">Envoyer</button>
  </div>
</form>
```

- Les `formArrays` sont très utiles pour générer des champs en fonction des besoins
- Ce qui contribue à rendre notre code dynamique !

[Exercice formulaire](https://www.notion.so/Exercice-formulaire-2acc756ed5a8483288b98187c54e50a3?pvs=21)
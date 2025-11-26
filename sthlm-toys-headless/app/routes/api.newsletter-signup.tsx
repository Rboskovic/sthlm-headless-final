import {type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    const body = await request.json() as {email?: string};
    const {email} = body;

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({error: 'E-postadress krävs'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({error: 'Ogiltig e-postadress'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const {storefront} = context;

    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      input: {
        email: email,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
        },
        acceptsMarketing: true,
      },
    };

    const response: any = await storefront.mutate(mutation, {variables});

    if (response.customerCreate?.customerUserErrors?.length > 0) {
      const error = response.customerCreate.customerUserErrors[0];
      
      if (error.code === 'TAKEN') {
        return new Response(
          JSON.stringify({success: true, message: 'E-post redan registrerad'}),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response(
        JSON.stringify({error: error.message || 'Något gick fel'}),
        {
          status: 400,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }

    return new Response(
      JSON.stringify({success: true, message: 'Prenumeration skapad'}),
      {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      }
    );
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return new Response(
      JSON.stringify({error: 'Ett oväntat fel inträffade'}),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      }
    );
  }
}